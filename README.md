# async-arch-course
## hw 0:
chart https://lucid.app/lucidchart/2a0ad6bb-3fdb-4bb5-8891-e04f84e783a7/edit?invitationId=inv_4f1d1362-8f77-464c-b414-ea883dddb718

### what if
1. database fails - some tasks could be reassigned more than ones. Accounting should be idempotent so it will cause no problems
2. queues fail - reassing and accounting wont happen. Daily cron must make sure that task was put to queue, so is retries until queue is up
3. api fails - ok, service dead, data does not change (except for daily cron)
4. reassigner failed - reassing wont happen. (mb should drop queue on restart?)
5. accounter fails - if idempotent and reassigner rollsback its things - it's ok
6. network fails - sad

### potential problems:
1. Task complition during reassignment (fixed by transaction rollback on reassignment?)
2. Task complition during daily accounting (fixed by blocking balance while accounting?)
3. Task reassignment during daily accounting (?)
4. calculating analytics and stats on demand (store things that will not change seperatly?)

### day 0 arch snapshot
<img width="1147" alt="image" src="https://user-images.githubusercontent.com/40774894/164344806-e3370531-6370-45ea-905a-425631d42979.png">
