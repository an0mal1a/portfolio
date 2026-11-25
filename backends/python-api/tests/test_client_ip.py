"""Run from backends/python-api: python -m unittest discover tests"""

import unittest
from ipaddress import ip_address

from starlette.datastructures import Headers

from services.depends.client_ip import client_ip, limit_key

PROXY = "10.0.1.5"
CLOUDFLARE = "162.158.10.20"
VISITOR = "203.0.113.7"


def resolve(peer: str, headers: list[tuple[str, str]]):
    raw = [(name.encode("latin-1"), value.encode("latin-1")) for name, value in headers]
    return client_ip(peer, Headers(raw=raw))


class ClientIpTest(unittest.TestCase):
    def test_tells_visitors_apart_behind_cloudflare_and_the_proxy(self):
        for visitor in (VISITOR, "198.51.100.9", "2001:db8::1"):
            headers = [("x-forwarded-for", CLOUDFLARE), ("cf-connecting-ip", visitor)]
            self.assertEqual(resolve(PROXY, headers), ip_address(visitor))

    def test_recognises_cloudflare_over_ipv6(self):
        headers = [("x-forwarded-for", "2a06:98c1::1"), ("cf-connecting-ip", VISITOR)]
        self.assertEqual(resolve(PROXY, headers), ip_address(VISITOR))

    def test_ignores_a_forged_header_from_someone_who_skips_cloudflare(self):
        headers = [("x-forwarded-for", VISITOR), ("cf-connecting-ip", "1.2.3.4")]
        self.assertEqual(resolve(PROXY, headers), ip_address(VISITOR))

    def test_believes_only_the_entry_our_proxy_added(self):
        one = [("x-forwarded-for", "1.2.3.4, 5.6.7.8, 203.0.113.7")]
        self.assertEqual(resolve(PROXY, one), ip_address(VISITOR))

        repeated = [("x-forwarded-for", "1.2.3.4"), ("x-forwarded-for", VISITOR)]
        self.assertEqual(resolve(PROXY, repeated), ip_address(VISITOR))

    def test_ignores_every_header_on_a_direct_public_connection(self):
        headers = [("x-forwarded-for", CLOUDFLARE), ("cf-connecting-ip", "1.2.3.4")]
        self.assertEqual(resolve(VISITOR, headers), ip_address(VISITOR))

    def test_reads_the_visitor_through_a_tunnel_or_docker_gateway(self):
        headers = [("x-forwarded-for", "172.18.0.1"), ("cf-connecting-ip", VISITOR)]
        self.assertEqual(resolve(PROXY, headers), ip_address(VISITOR))

    def test_falls_back_to_what_it_knows(self):
        self.assertEqual(resolve(PROXY, []), ip_address(PROXY))
        self.assertEqual(resolve("::ffff:10.0.1.5", []), ip_address(PROXY))
        self.assertEqual(resolve(PROXY, [("x-forwarded-for", "nonsense")]), ip_address(PROXY))

        headers = [("x-forwarded-for", CLOUDFLARE), ("cf-connecting-ip", "nonsense")]
        self.assertEqual(resolve(PROXY, headers), ip_address(CLOUDFLARE))

    def test_counts_an_ipv6_network_as_one_visitor(self):
        self.assertEqual(
            limit_key(ip_address("2001:db8:1:2::a")),
            limit_key(ip_address("2001:db8:1:2:ffff::b")),
        )
        self.assertNotEqual(
            limit_key(ip_address("2001:db8:1:2::a")),
            limit_key(ip_address("2001:db8:1:3::a")),
        )
        self.assertEqual(limit_key(resolve("::ffff:203.0.113.7", [])), ip_address(VISITOR))


if __name__ == "__main__":
    unittest.main()
