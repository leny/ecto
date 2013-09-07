# ecto

Simple/fast node.js blogging system.

* * *

**ecto** is an educational project, which i wish to use as a support for node.js courses.

**ecto** est un projet d'apprentissage, que j'aimerai utiliser comme support de cours sur node.js.

# Environnement

Afin de commencer à travailler sur **ecto**, il vous faut d'abord installer [http://www.vagrantup.com/](Vagrant).

Une fois cela fait et le repo d'**ecto** cloné sur votre machine, utilisez la ligne de commande et entrez :

    $> vagrant up && vagrant ssh

Une fois la procédure d'installation terminée (ça peut prendre quelques minutes), vous serez connectés à la machine virtuelle d'**ecto**, entrez les commandes suivantes pour commencer à travailler :

    $> cd /vagrant
    $> grunt work

Vous devriez pouvoir vous connecter à l'adresse [http://10.0.1.50/](http://10.0.1.50/) et voir le `Hello, World !` **ecto**.

Tant que la tâche *grunt* n'est pas intérrompue, à chaque modification d'un fichier de code, *grunt* passera votre projet à *JSHint* puis relancera le server, afin que vous puissiez voir immédiatement les modifications en rechargeant la page du navigateur.
