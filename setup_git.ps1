# Изтриване на .git директорията
Remove-Item -Recurse -Force .git

# Инициализиране на нов Git репозиторий
git init

# Добавяне на отдалеченото хранилище
git remote add origin https://github.com/IvanKourtev/Free_Bet.git

# Добавяне на всички файлове
git add .

# Създаване на първоначален commit
git commit -m "Initial commit"

# Push към отдалеченото хранилище
git push -u origin main --force 