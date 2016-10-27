case $OSTYPE in
  linux*)
    if ! hash mongod 2>/dev/null; then
      sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
      echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
      sudo apt-get update
      sudo apt-get install -y mongodb-org
      echo "mongodb-org hold" | sudo dpkg --set-selections
      echo "mongodb-org-server hold" | sudo dpkg --set-selections
      echo "mongodb-org-shell hold" | sudo dpkg --set-selections
      echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
      echo "mongodb-org-tools hold" | sudo dpkg --set-selections
    else
        echo "Mongod already running"
    fi
    ;;
  darwin*)
    if ! hash mongod 2>/dev/null; then
      brew update
      brew install mongodb
    else
      echo "Mongod already running"
    fi
    ;;
  bsd*)
    echo "Installation steps missing for $OSTYPE, please add :-')"
    ;;
  solaris*)
    echo "Installation steps missing for $OSTYPE, please add :-')"
    ;;
  *)
  echo "Installation steps missing for $OSTYPE, please add :-')"
  ;;
esac
chef gem install knife-block
