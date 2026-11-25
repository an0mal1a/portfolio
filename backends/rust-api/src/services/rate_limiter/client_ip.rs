//! Who is really calling. In production every connection arrives from the reverse
//! proxy, with Cloudflare in front of it, so the socket address is the same for
//! everybody and a limit keyed on it would be shared by all visitors.

use std::{
    net::{IpAddr, Ipv6Addr},
    sync::LazyLock,
};

use axum::http::HeaderMap;
use ipnet::IpNet;

/// https://www.cloudflare.com/ips (checked 2026-11-25).
static CLOUDFLARE: LazyLock<Vec<IpNet>> = LazyLock::new(|| {
    [
        "173.245.48.0/20",
        "103.21.244.0/22",
        "103.22.200.0/22",
        "103.31.4.0/22",
        "141.101.64.0/18",
        "108.162.192.0/18",
        "190.93.240.0/20",
        "188.114.96.0/20",
        "197.234.240.0/22",
        "198.41.128.0/17",
        "162.158.0.0/15",
        "104.16.0.0/13",
        "104.24.0.0/14",
        "172.64.0.0/13",
        "131.0.72.0/22",
        "2400:cb00::/32",
        "2606:4700::/32",
        "2803:f800::/32",
        "2405:b500::/32",
        "2405:8100::/32",
        "2a06:98c0::/29",
        "2c0f:f248::/32",
    ]
    .iter()
    .map(|range| range.parse().expect("Cloudflare ranges are valid"))
    .collect()
});

/// The visitor's address, believing each header only as far as the hop that wrote it:
/// the reverse proxy appends the address it saw to `X-Forwarded-For`, and
/// `CF-Connecting-IP` only counts when that address is Cloudflare's. Anyone who skips
/// Cloudflare is identified by the address they connect from, whatever they claim.
pub fn client_ip(peer: IpAddr, headers: &HeaderMap) -> IpAddr {
    let peer = peer.to_canonical();
    if !is_internal(peer) {
        return peer;
    }

    // No header: another service of the stack, or a local run.
    let Some(seen_by_proxy) = last_forwarded(headers) else {
        return peer;
    };

    // An internal address is a tunnel or Docker's gateway: the visitor is further out.
    if is_internal(seen_by_proxy) || is_cloudflare(seen_by_proxy) {
        return header_ip(headers).unwrap_or(seen_by_proxy);
    }

    seen_by_proxy
}

/// What a limit counts as one visitor. A home or a server usually owns a whole IPv6
/// /64, so counting single addresses would let one machine use a new one each time.
pub fn limit_key(ip: IpAddr) -> IpAddr {
    match ip.to_canonical() {
        IpAddr::V4(ip) => IpAddr::V4(ip),
        IpAddr::V6(ip) => IpAddr::V6(Ipv6Addr::from_bits(ip.to_bits() & (u128::MAX << 64))),
    }
}

/// The right-most entry is the one our own proxy added; the rest is the caller's word.
fn last_forwarded(headers: &HeaderMap) -> Option<IpAddr> {
    let last = headers.get_all("x-forwarded-for").iter().next_back()?;
    parse_ip(last.to_str().ok()?.rsplit(',').next()?)
}

fn header_ip(headers: &HeaderMap) -> Option<IpAddr> {
    parse_ip(headers.get("cf-connecting-ip")?.to_str().ok()?)
}

fn parse_ip(value: &str) -> Option<IpAddr> {
    value.trim().parse::<IpAddr>().ok().map(|ip| ip.to_canonical())
}

fn is_cloudflare(ip: IpAddr) -> bool {
    CLOUDFLARE.iter().any(|range| range.contains(&ip))
}

fn is_internal(ip: IpAddr) -> bool {
    match ip {
        IpAddr::V4(ip) => ip.is_private() || ip.is_loopback() || ip.is_link_local(),
        IpAddr::V6(ip) => ip.is_loopback() || ip.is_unique_local() || ip.is_unicast_link_local(),
    }
}

#[cfg(test)]
mod tests {
    use super::{client_ip, limit_key};
    use axum::http::{HeaderMap, HeaderValue};
    use std::net::IpAddr;

    const PROXY: &str = "10.0.1.5";
    const CLOUDFLARE: &str = "162.158.10.20";
    const VISITOR: &str = "203.0.113.7";

    fn ip(value: &str) -> IpAddr {
        value.parse().unwrap()
    }

    fn resolve(peer: &str, headers: &[(&'static str, &str)]) -> IpAddr {
        let mut map = HeaderMap::new();
        for (name, value) in headers {
            map.append(*name, HeaderValue::from_str(value).unwrap());
        }
        client_ip(ip(peer), &map)
    }

    #[test]
    fn tells_visitors_apart_behind_cloudflare_and_the_proxy() {
        for visitor in [VISITOR, "198.51.100.9", "2001:db8::1"] {
            let headers = [("x-forwarded-for", CLOUDFLARE), ("cf-connecting-ip", visitor)];
            assert_eq!(resolve(PROXY, &headers), ip(visitor));
        }
    }

    #[test]
    fn recognises_cloudflare_over_ipv6() {
        let headers = [("x-forwarded-for", "2a06:98c1::1"), ("cf-connecting-ip", VISITOR)];
        assert_eq!(resolve(PROXY, &headers), ip(VISITOR));
    }

    #[test]
    fn ignores_a_forged_header_from_someone_who_skips_cloudflare() {
        let headers = [("x-forwarded-for", VISITOR), ("cf-connecting-ip", "1.2.3.4")];
        assert_eq!(resolve(PROXY, &headers), ip(VISITOR));
    }

    #[test]
    fn believes_only_the_entry_our_proxy_added() {
        let one = [("x-forwarded-for", "1.2.3.4, 5.6.7.8, 203.0.113.7")];
        assert_eq!(resolve(PROXY, &one), ip(VISITOR));

        let repeated = [("x-forwarded-for", "1.2.3.4"), ("x-forwarded-for", VISITOR)];
        assert_eq!(resolve(PROXY, &repeated), ip(VISITOR));
    }

    #[test]
    fn ignores_every_header_on_a_direct_public_connection() {
        let headers = [("x-forwarded-for", CLOUDFLARE), ("cf-connecting-ip", "1.2.3.4")];
        assert_eq!(resolve(VISITOR, &headers), ip(VISITOR));
    }

    #[test]
    fn reads_the_visitor_through_a_tunnel_or_docker_gateway() {
        let headers = [("x-forwarded-for", "172.18.0.1"), ("cf-connecting-ip", VISITOR)];
        assert_eq!(resolve(PROXY, &headers), ip(VISITOR));
    }

    #[test]
    fn falls_back_to_what_it_knows() {
        assert_eq!(resolve(PROXY, &[]), ip(PROXY));
        assert_eq!(resolve("::ffff:10.0.1.5", &[]), ip(PROXY));
        assert_eq!(resolve(PROXY, &[("x-forwarded-for", "nonsense")]), ip(PROXY));

        let headers = [("x-forwarded-for", CLOUDFLARE), ("cf-connecting-ip", "nonsense")];
        assert_eq!(resolve(PROXY, &headers), ip(CLOUDFLARE));
    }

    #[test]
    fn counts_an_ipv6_network_as_one_visitor() {
        assert_eq!(limit_key(ip("2001:db8:1:2::a")), limit_key(ip("2001:db8:1:2:ffff::b")));
        assert_ne!(limit_key(ip("2001:db8:1:2::a")), limit_key(ip("2001:db8:1:3::a")));
        assert_eq!(limit_key(ip("::ffff:203.0.113.7")), ip(VISITOR));
    }
}
