## Queries:

**Пользователь может получить свой дашборд тасок**

(Каждый сотрудник должен иметь возможность видеть в отдельном месте список заассайненных на него задач)

* Actor — account
* Query — get my tasks
* Data — tasks

**Админ и бухалтер может видеть общий аккаунтинг**

(Аккаунтинг должен быть в отдельном дашборде и доступным только для администраторов и бухгалтеров, у админов и бухгалтеров должен быть доступ к общей статистике по деньгами заработанным (количество заработанных топ-менеджментом за сегодня денег + статистика по дням))

* Actor — account: role == *accountant* or *admin*
* Query — get accounting
* Data — money made today (audit log aggregate) + daily stats

**Пользователь может получить информацию о своих счетах**

(у обычных попугов доступ к аккаунтингу тоже должен быть. Но только к информации о собственных счетах (аудит лог + текущий баланс)
У каждого из сотрудников должен быть свой счёт, который показывает, сколько за сегодня он получил денег. У счёта должен быть аудитлог того, за что были списаны или начислены деньги, с подробным описанием каждой из задач)

* Actor — account
* Query — get my accounting
* Data — current balance (auditLog aggregate) + auditLog == (money flow + task data)[]

**Админ может открыть дашборд аналитики**

(Аналитика — это отдельный дашборд, доступный только админам.
Нужно указывать, сколько заработал топ-менеджмент за сегодня и сколько попугов ушло в минус.
Нужно показывать самую дорогую задачу за день, неделю или месяц.)

* Actor — account: role = *admin*
* Query — get analytics
* Data — 
money made today, (auditLog aggregate)
negative balances count, (auditLog aggregate)
most expencive tasks (analytics)

## Commands:

**Пользователь может войти в систему**

(Авторизация в таск-трекере должна выполняться через общий сервис авторизации UberPopug Inc
Авторизация в дешборде аккаунтинга должна выполняться через общий сервис аутентификации UberPopug Inc)

* Actor — account
* Command — Login to Task tracker
* Data — account.id / token
* Event — account.loggedIn (not used)

### Цепочка создания таски

**Пользователь может добавить таски** 

(Новые таски может создавать кто угодно (администратор, начальник, разработчик, менеджер и любая другая роль). У задачи должны быть описание, статус (выполнена или нет) и попуг, на которого заассайнена задача.
Ассайнить задачу можно на кого угодно (кроме менеджера и администратора))

* Actor — account
* Command — Add task
* Data — task (name, description, assignedTo(randomly generated) etc)
* Event — task.added


**Новой таске нужно определить цену и провести первичное списание**

(цены на задачу определяется единоразово, в момент появления в системе)

* Actor — task.added
* Command — set task price
* Data — task + prices, auditLog
* Event — none

### Цепочка реайссайна тасок

**Менеджеры или администраторы могут рандомно реассайнить все таски**

(Менеджеры или администраторы должны иметь кнопку «заассайнить задачи», которая возьмёт все открытые задачи и рандомно заассайнит каждую на любого из сотрудников (кроме менеджера и администратора))

* Actor — account: role == *manager* or *admin*
* Command — Reassign all open tasks
* Data — many tasks + many accounts
* Event — many task.assigned

**Нужно списать деньги за ассигн таски**

(деньги списываются сразу после ассайна на сотрудника)

* Actor — task.assigned
* Command — charge for task assignment
* Data — task + prices, auditLog
* Event — none

### Цепочка завершения таски

**Пользователь может отметить таску выполненной**

(Каждый сотрудник должен иметь возможность отметить задачу выполненной.)

* Actor — account: task.assignedTo == account
* Command — complete task
* Data — task
* Event — task.completed

**Нужно начислить деньги за выполненную задачу**

(а начисляются после выполнения задачи.)

* Actor — task.completed
* Command —  add payment
* Data — task + price, auditLog
* Event — none

**Нужно "проанализировать" завершенную задачу**

(Нужно показывать самую дорогую задачу за день, неделю или месяц.)

* Actor — task.completed
* Command —  analyze complited task
* Data — task + price, analytics 
* Event — none

### Цепочка подсчета в конце дня

**Нужно сделать выплаты по положительным балансам**

(Каждый сотрудник должен иметь возможность отметить задачу выполненной.)

* Actor — day ended (event sent by some cron?)
* Command — start summary
* Data — many (auditLog + account) + save daily stats
* Event — many account.payout

**Нужно оправить письмо**

(b) отправлять на почту сумму выплаты.)

* Actor — account.payout
* Command —  send payout email
* Data — auditLog + account
* Event — account.payoutSent (not used)