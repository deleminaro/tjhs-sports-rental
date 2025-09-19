# 🏫 TJHS Sports Rental System

A comprehensive sports equipment rental system for **The Jannali High School (TJHS)** in Sydney Sutherland.

![TJHS Sports Rental](https://img.shields.io/badge/Status-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.5-38B2AC)

## 🌟 **Live Demo**

**🔗 [View Live Site](https://YOUR_USERNAME.github.io/tjhs-sports-rental)**

## ✨ **Features**

### 👨‍🎓 **For Students**
- **Easy Registration**: Create account with student ID and year level
- **Flexible Booking**: Rent equipment for any day up to 30 days in advance
- **Rental History**: View all past and current rentals with search/filter
- **Mobile App**: Install as PWA on phones and tablets
- **Real-time Updates**: Live equipment availability

### 👨‍🏫 **For Teachers**
- **Rental Management**: View and manage all equipment rentals
- **Bulk Operations**: Return multiple items at once
- **Student Lookup**: Find rentals by student name or ID
- **Overdue Tracking**: Identify and return overdue equipment
- **Quick Actions**: One-click return for overdue items

### 👨‍💼 **For Administrators**
- **System Overview**: Complete statistics and analytics dashboard
- **Equipment Management**: Add, edit, and remove equipment items
- **User Management**: Track student registrations and activity
- **Email Notifications**: Send overdue notices to students
- **QR Code System**: Generate QR codes for quick equipment checkout
- **Data Export**: Export rental data and reports

## 🚀 **Quick Start**

### **Option 1: Use Live Site**
1. Visit the live site: `https://YOUR_USERNAME.github.io/tjhs-sports-rental`
2. Create a student account or use admin login
3. Start renting equipment!

### **Option 2: Run Locally**
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/tjhs-sports-rental.git

# Navigate to project
cd tjhs-sports-rental

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🔐 **Admin Access**

- **Email:** `admin@TJHS`
- **Password:** `admin2025`

## 📱 **Mobile Features**

- **Progressive Web App (PWA)**: Install on any device
- **Offline Support**: Basic functionality without internet
- **Touch Optimized**: Perfect for phones and tablets
- **Fast Loading**: Optimized for mobile networks

## 🏫 **School Information**

**The Jannali High School (TJHS)**
- **Location**: Sydney Sutherland, NSW, Australia
- **Rental Times**: 
  - Recess: 11:00 AM - 11:30 AM
  - Lunch: 12:30 PM - 1:00 PM
- **Equipment**: Soccer balls, Basketballs, Handballs, Rugby balls
- **Cost**: Free for all students

## 🛠 **Technology Stack**

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: GitHub Pages
- **PWA**: Service Worker + Manifest

## 📊 **System Capabilities**

- **User Management**: Student, Teacher, Admin roles
- **Equipment Tracking**: Real-time inventory management
- **Rental System**: Time-slot based booking
- **Data Persistence**: Local storage with backup
- **Mobile Ready**: Responsive design for all devices
- **Offline Support**: Basic functionality without internet

## 🎯 **Use Cases**

### **Daily Operations**
- Students book equipment for recess/lunch
- Teachers manage returns and checkouts
- Admins monitor system usage and equipment

### **Special Events**
- Bulk equipment preparation for sports days
- Track equipment usage during events
- Generate reports for school administration

### **Equipment Management**
- Add new equipment types
- Track equipment condition and maintenance
- Generate QR codes for quick checkout

## 🔧 **Development**

### **Project Structure**
```
tjhs-sports-rental/
├── components/          # React components
│   ├── Admin/          # Admin-specific components
│   ├── Student/        # Student-specific components
│   ├── Teacher/        # Teacher-specific components
│   └── Layout/         # Shared layout components
├── store/              # State management
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── public/             # Static assets
```

### **Key Components**
- **App.tsx**: Main application component
- **LoginForm.tsx**: User authentication
- **EquipmentRental.tsx**: Equipment booking system
- **AdminDashboard.tsx**: Admin management interface
- **TeacherDashboard.tsx**: Teacher management interface
- **StudentDashboard.tsx**: Student interface

## 📈 **Performance**

- **Fast Loading**: Optimized bundle size
- **Responsive**: Works on all screen sizes
- **Offline Ready**: Basic functionality without internet
- **Mobile First**: Designed for mobile devices

## 🤝 **Contributing**

This is a school project for TJHS. For modifications or improvements, please contact the school administration.

## 📄 **License**

This project is created for educational purposes at The Jannali High School.

## 📞 **Support**

For technical support or questions:
1. Check the [Deployment Guide](DEPLOYMENT.md)
2. Review the [GitHub Issues](https://github.com/YOUR_USERNAME/tjhs-sports-rental/issues)
3. Contact the school IT department

---

**Made with ❤️ for The Jannali High School**

*Empowering students through technology*