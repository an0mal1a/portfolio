"""Who is really calling. In production every connection arrives from the reverse
proxy, with Cloudflare in front of it, so the socket address is the same for
everybody and a limit keyed on it would be shared by all visitors.

Same rules as backends/rust-api/src/services/rate_limiter/client_ip.rs: change both
together.
"""

from ipaddress import IPv4Address, IPv6Address, ip_address, ip_network

from starlette.datastructures import Headers

IP = IPv4Address | IPv6Address

# https://www.cloudflare.com/ips (checked 2026-11-25).
CLOUDFLARE = [
    ip_network(cidr)
    for cidr in (
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
    )
]

# Private, loopback and link-local, as in the Rust API. Python's `is_private` would
# also count documentation and benchmark ranges.
INTERNAL = [
    ip_network(cidr)
    for cidr in (
        "10.0.0.0/8",
        "172.16.0.0/12",
        "192.168.0.0/16",
        "127.0.0.0/8",
        "169.254.0.0/16",
        "::1/128",
        "fc00::/7",
        "fe80::/10",
    )
]


def client_ip(peer: str, headers: Headers) -> IP:
    """The visitor's address, believing each header only as far as the hop that wrote
    it: the reverse proxy appends the address it saw to `X-Forwarded-For`, and
    `CF-Connecting-IP` only counts when that address is Cloudflare's. Anyone who skips
    Cloudflare is identified by the address they connect from, whatever they claim.
    """
    peer_ip = parse_ip(peer)
    if peer_ip is None:
        raise ValueError(f"unexpected peer address: {peer!r}")

    if not is_internal(peer_ip):
        return peer_ip

    # No header: another service of the stack, or a local run.
    seen_by_proxy = last_forwarded(headers)
    if seen_by_proxy is None:
        return peer_ip

    # An internal address is a tunnel or Docker's gateway: the visitor is further out.
    if is_internal(seen_by_proxy) or is_cloudflare(seen_by_proxy):
        return parse_ip(headers.get("cf-connecting-ip")) or seen_by_proxy

    return seen_by_proxy


def limit_key(ip: IP) -> IP:
    """What a limit counts as one visitor. A home or a server usually owns a whole IPv6
    /64, so counting single addresses would let one machine use a new one each time.
    """
    if isinstance(ip, IPv6Address):
        return IPv6Address(int(ip) >> 64 << 64)
    return ip


def last_forwarded(headers: Headers) -> IP | None:
    """The right-most entry is the one our own proxy added; the rest is the caller's word."""
    values = headers.getlist("x-forwarded-for")
    return parse_ip(values[-1].rsplit(",", 1)[-1]) if values else None


def parse_ip(value: str | None) -> IP | None:
    try:
        ip = ip_address(value.strip())
    except (AttributeError, ValueError):
        return None
    if isinstance(ip, IPv6Address):
        # A scoped address names the same host on every interface.
        ip = IPv6Address(int(ip))
        if ip.ipv4_mapped:
            return ip.ipv4_mapped
    return ip


def is_cloudflare(ip: IP) -> bool:
    return any(ip in network for network in CLOUDFLARE)


def is_internal(ip: IP) -> bool:
    return any(ip in network for network in INTERNAL)
