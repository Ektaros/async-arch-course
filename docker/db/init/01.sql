-- create databases
CREATE DATABASE IF NOT EXISTS `popugs-auth`;
CREATE DATABASE IF NOT EXISTS `popugs-tasks`;
CREATE DATABASE IF NOT EXISTS `popugs-money`;

-- grant rights to user
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%';