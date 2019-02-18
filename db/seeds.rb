User.where(email: 'admin@example.com').first_or_create! first_name: 'Admin', last_name: 'Admin', password: 'password', lang: :en, admin: true
User.where(email: 'manager@example.com').first_or_create! first_name: 'Manager', last_name: 'Manager', password: 'password', lang: :en, manager: true
User.where(email: 'user@example.com').first_or_create! first_name: 'User', last_name: 'User', password: 'password', lang: :en

Project.where(name: 'Lunch').first_or_create! internal: true, lunch: true
Project.where(name: 'Vacation').first_or_create! internal: true, autofill: true
