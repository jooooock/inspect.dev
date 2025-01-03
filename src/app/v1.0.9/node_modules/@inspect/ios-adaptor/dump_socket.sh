
#!/bin/bash
# Parameters
socket="/private/tmp/com.apple.launchd.1mJX23NPQ3/com.apple.webinspectord_sim.socket"
dump="/Users/auchenberg/simulator.pcap"

# https://mivehind.net/2018/04/20/sniffing-unix-domain-sockets/

# Extract repetition
port=9875
source_socket="$(dirname "${socket}")/$(basename "${socket}").orig"

# Move socket files
mv "${socket}" "${source_socket}"
trap "{ rm '${socket}'; mv '${source_socket}' '${socket}'; }" EXIT
# Setup pipe over TCP that we can tap into
socat -t100 "TCP-LISTEN:${port},reuseaddr,fork" "UNIX-CONNECT:${source_socket}" &
# Record traffic
tshark -i lo -w "${dump}" -F pcapng "dst port ${port} or src port ${port}"
# tcpdump -ni lo -w "${dump}" -s0 -f "tcp port ${port}"
# Forward traffic back to socket
socat -t100 "UNIX-LISTEN:${socket},mode=777,reuseaddr,fork" "TCP:localhost:${port}" &