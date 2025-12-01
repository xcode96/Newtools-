
import { Tool } from './types';

export const toolsData: Tool[] = [
  {
    id: 'nmap',
    name: 'Nmap',
    type: 'CLI / GUI',
    description: 'A powerful network scanner for security auditing and discovery.',
    tags: ['port scanning', 'os detection', 'network mapping']
  },
  {
    id: 'netbios',
    name: 'NetBIOS',
    type: 'CLI',
    description: 'Network Basic Input/Output System protocol reference and enumeration tools.',
    tags: ['windows', 'enumeration', 'legacy', 'protocol']
  },
  {
    id: 'jq',
    name: 'JQ (JSON)',
    type: 'CLI',
    description: 'A lightweight and flexible command-line JSON processor.',
    tags: ['json', 'parser', 'scripting']
  },
  {
    id: 'markdown',
    name: 'Markdown',
    type: 'Library',
    description: 'A lightweight markup language for creating formatted text using a plain-text editor.',
    tags: ['documentation', 'syntax', 'writing']
  },
  {
    id: 'ntopng',
    name: 'Ntopng',
    type: 'CLI / GUI',
    description: 'A web-based network traffic monitoring application.',
    tags: ['network monitoring', 'traffic analysis', 'real-time']
  },
  {
    id: 'wireshark',
    name: 'Wireshark',
    type: 'GUI',
    description: "The world's foremost network protocol analyzer for traffic inspection.",
    tags: ['packet analysis', 'protocol inspection', 'troubleshooting']
  },
  {
    id: 'tcpdump',
    name: 'tcpdump',
    type: 'CLI',
    description: 'A powerful command-line packet analyzer for network monitoring.',
    tags: ['packet sniffing', 'network monitoring', 'debugging']
  },
  {
    id: 'masscan',
    name: 'Masscan',
    type: 'CLI',
    description: 'An incredibly fast TCP port scanner for large-scale network surveys.',
    tags: ['fast scanning', 'port scanner', 'network survey']
  },
  {
    id: 'netcat',
    name: 'Netcat',
    type: 'CLI',
    description: 'A versatile networking utility for reading/writing data across network connections.',
    tags: ['port listening', 'port scanning', 'file transfer']
  },
  {
    id: 'zmap',
    name: 'Zmap',
    type: 'CLI',
    description: 'An open-source network scanner that enables researchers to easily perform Internet-wide network studies.',
    tags: ['internet-wide scan', 'network research', 'fast scanning']
  },
  {
    id: 'hping3',
    name: 'hping3',
    type: 'CLI',
    description: 'A command-line oriented TCP/IP packet assembler/analyzer. The interface is inspired to the ping unix command.',
    tags: ['packet crafting', 'firewall testing', 'traceroute']
  },
  {
    id: 'dig',
    name: 'dig',
    type: 'CLI',
    description: '(Domain Information Groper) A flexible tool for interrogating DNS name servers.',
    tags: ['dns', 'lookup', 'troubleshooting']
  },
  {
    id: 'nslookup',
    name: 'nslookup',
    type: 'CLI',
    description: 'A network administration command-line tool for querying the Domain Name System (DNS).',
    tags: ['dns', 'lookup', 'legacy']
  },
  {
    id: 'whois',
    name: 'whois',
    type: 'CLI',
    description: 'A query and response protocol that is widely used for querying databases that store the registered users of an Internet resource.',
    tags: ['domain registration', 'osint', 'information gathering']
  },
  {
    id: 'traceroute',
    name: 'traceroute',
    type: 'CLI',
    description: 'A computer network diagnostic tool for displaying the route (path) and measuring transit delays of packets.',
    tags: ['network path', 'latency', 'debugging']
  },
  {
    id: 'arp-scan',
    name: 'arp-scan',
    type: 'CLI',
    description: 'A command-line tool that uses the ARP protocol to discover and fingerprint IP hosts on the local network.',
    tags: ['arp', 'lan discovery', 'mac address']
  },
  {
    id: 'angry-ip-scanner',
    name: 'Angry IP Scanner',
    type: 'GUI',
    description: 'A very fast and small IP scanner. It pings each IP address to check if it’s alive, then optionally it is resolving its hostname.',
    tags: ['ip scanner', 'port scanner', 'fast']
  },
  {
    id: 'etherape',
    name: 'EtherApe',
    type: 'GUI',
    description: 'A graphical network monitor for Unix modeled after etherman. It displays network activity graphically.',
    tags: ['visualization', 'network traffic', 'monitoring']
  },
  {
    id: 'scapy',
    name: 'Scapy',
    type: 'CLI / Library',
    description: 'A powerful Python-based interactive packet manipulation program and library.',
    tags: ['packet crafting', 'python', 'protocol development']
  },
  {
    id: 'zeek',
    name: 'Zeek (Bro)',
    type: 'CLI',
    description: 'A powerful network analysis framework that is much different from the typical IDS you may know.',
    tags: ['nids', 'traffic logging', 'security monitoring']
  },
  {
    id: 'suricata',
    name: 'Suricata',
    type: 'CLI',
    description: 'A high performance Network IDS, IPS and Network Security Monitoring engine.',
    tags: ['ids', 'ips', 'threat detection']
  },
  {
    id: 'snort',
    name: 'Snort',
    type: 'CLI',
    description: 'An open-source, free and lightweight network intrusion detection system (NIDS) software for Linux and Windows.',
    tags: ['nids', 'packet sniffer', 'rule-based']
  },
  {
    id: 'ngrep',
    name: 'ngrep',
    type: 'CLI',
    description: "(network grep) strives to provide most of GNU grep's common features, applying them to the network layer.",
    tags: ['grep', 'network layer', 'pattern matching']
  },
  {
    id: 'iperf',
    name: 'iperf',
    type: 'CLI',
    description: 'A tool for active measurements of the maximum achievable bandwidth on IP networks.',
    tags: ['bandwidth test', 'performance', 'network tuning']
  }
];
