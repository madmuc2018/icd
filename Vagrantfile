def common_config(config, memory = "512")
  config.vm.hostname="vagrant"
  config.vm.synced_folder ".", "/mnt/vagrant"
  config.vm.box_check_update = false
  config.vm.provider "virtualbox" do |v|
    v.customize ["modifyvm", :id, "--cpuexecutioncap", "100"]
    v.customize ["modifyvm", :id, "--memory", memory]
  end

  # https://github.com/hashicorp/vagrant/issues/7508
  config.vm.provision "fix-no-tty", type: "shell" do |s|
    s.privileged = false
    s.inline = "sudo sed -i '/tty/!s/mesg n/tty -s \\&\\& mesg n/' /root/.profile"
  end

  # https://github.com/hashicorp/vagrant/issues/7508
  config.vm.provision "disable-apt-periodic-updates", type: "shell" do |s|
    s.privileged = true
    s.inline = "echo 'APT::Periodic::Enable \"0\";' > /etc/apt/apt.conf.d/02periodic"
  end

  config.vm.provision "shell", inline: <<-SHELL
    apt-get --purge unattended-upgrades
    apt-get update
    function install-make() {
      while pgrep unattended; do sleep 10; done;
      apt-get install -y build-essential
    }
    which make || install-make
  SHELL
end

def forward_port(config, guest, host = guest)
  config.vm.network :forwarded_port, guest: guest, host: host, auto_correct: true
end

def install_node(config)
  config.vm.provision "shell", inline: <<-SHELL
    curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
    while pgrep unattended; do sleep 10; done;
    apt-get install -y nodejs
  SHELL
end

Vagrant.configure("2") do |vagrant_conf|
  vagrant_conf.vm.define "devbox" do |config|
    common_config(config, "3000")
    install_node(config)
    forward_port(config, 3000)
    forward_port(config, 5000)
    config.vm.box = "ubuntu/xenial64"
  end
end