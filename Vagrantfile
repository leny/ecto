$script = <<SCRIPT
START_TIME=$SECONDS
apt-get update
apt-get upgrade -y
echo "SELINUX=disabled" >> /etc/selinux/config
# -- NODE
add-apt-repository ppa:chris-lea/node.js
apt-get update
apt-get install -y nodejs
npm install -g n
n stable
# --- npm packages (list needed packages here)
npm install -g grunt-cli
npm install -g nodemon
# /-- npm packages
# -- END
ELAPSED_TIME=$(($SECONDS - $START_TIME))
# clear
echo "------------------------"
echo "- Provisionning ended. -"
echo "------------------------"
echo "Duration : $(($ELAPSED_TIME/60)) min $(($ELAPSED_TIME%60)) sec"
echo "-- node `node --version`"
echo "-- npm v`npm --version`"
echo "------------------------"
SCRIPT

Vagrant.configure("2") do |config|
    config.vm.box = "raring32"
    config.vm.box_url = "http://cloud-images.ubuntu.com/vagrant/raring/current/raring-server-cloudimg-i386-vagrant-disk1.box"

    config.vm.provision :shell, :inline => $script

    config.vm.hostname = "blog.ecto.lan"
    config.vm.network :private_network, ip: "10.0.1.50"

    config.vm.provider "virtualbox" do |v|
      v.name = "ecto"
    end
end
