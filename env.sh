#!/bin/sh

_gport=
_glsrv={NODE_ENV_GLSRV}

Usage() {
	cat <<-EOF
		Usage: $0 OPTION...
		Forward local to remote.

		  -p      local port
	EOF
}

while getopts "p:h" opt; do
	case "${opt}" in
	p)
		_gport=${OPTARG}
		;;
	h)
		Usage
		exit
		;;
	\?)
		Usage >&2
		exit 1
		;;
	esac
done
shift $((OPTIND-1))

if [ "X$_gport" = "X" ]; then
	printf "forward pord do not specified!\\n"
	exit 2
fi

if pgrep -f -l ssh|grep -qsw "$_gport:localhost:$_glsrv";then
	printf "connection already setup.\\n"
	exit 0
fi

if grep -qsiw 1004kc /proc/cpuinfo;then
	target="mtmips_1004kc"
elif grep -qsiw 24kec /proc/cpuinfo;then
	target="mtmips_24kec"
fi

# Install openssh client instead dropbear client
if ! opkg list|grep -qs openssh-client; then
	wget -O /tmp/openssh-client.ipk http://dl.nradio.com.cn/ipk/openssh-client_7.4p1-1_${target}.ipk
	opkg install --force-overwrite /tmp/openssh-client.ipk
fi

# Check to start dropbear
if ! pgrep dropbear &>/dev/null; then
	uci -q set security.security.ssh=1
	uci -q set secruity.secruity.ssh=1
	/etc/init.d/dropbear start &
fi

mkdir -p /root/.ssh

# Init identify
cat >/root/.ssh/id_rsa <<EOF
{NODE_ENV_SSH_KEY}
EOF

# Init config
cat >/root/.ssh/config <<EOF
Host *
  StrictHostKeyChecking no
  UserKnownHostsFile=/dev/null
  ServerAliveInterval 60
  PubkeyAuthentication yes

Host rweb
  HostName {NODE_ENV_RTYPE_URL}
  Port 22223
  User debug

Host rssh
  HostName {NODE_ENV_RTYPE_URL}
  Port 22222
  User debug
EOF

chmod 400 /root/.ssh/id_rsa
chmod 600 /root/.ssh/config

# Start rssh
ssh -gfNTR "$_gport:localhost:$_glsrv" {NODE_ENV_RTYPE}

# Check rssh
if ! pgrep ssh &>/dev/null; then
	printf "rssh do not start correctly!\\nchange another port to try again.\\n"
	exit 4
fi

cat <<-EOF
*************
Ready to RSSH
Port: %s $_gport
*************
EOF
