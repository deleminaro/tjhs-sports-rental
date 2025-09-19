# 🚀 TJHS Sports Rental - Complete Setup Guide

## 📋 **Prerequisites**

Before you start, make sure you have:
- [Node.js 18+](https://nodejs.org/) installed
- [Git](https://git-scm.com/) installed
- A [GitHub account](https://github.com/)

## 🎯 **Step-by-Step Setup**

### **Step 1: Prepare Your Project**

1. **Create a new folder** for your GitHub project:
   ```
   C:\Users\ivans\OneDrive\Документы\tjhs-sports-rental
   ```

2. **Copy all your current files** from the `rentals` folder to the new `tjhs-sports-rental` folder

3. **Verify you have these files**:
   - `package.json`
   - `next.config.js`
   - `tailwind.config.js`
   - `tsconfig.json`
   - `components/` folder
   - `store/` folder
   - `types/` folder
   - `utils/` folder
   - `pages/` folder
   - `styles/` folder
   - `public/` folder
   - `.github/workflows/deploy.yml`

### **Step 2: Create GitHub Repository**

1. **Go to GitHub.com** and sign in
2. **Click "New repository"** (green button)
3. **Repository name**: `tjhs-sports-rental`
4. **Description**: `Sports equipment rental system for The Jannali High School`
5. **Make it Public** (required for free GitHub Pages)
6. **Don't initialize** with README, .gitignore, or license
7. **Click "Create repository"**

### **Step 3: Upload to GitHub**

#### **Option A: Using GitHub Desktop (Recommended)**

1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Install and sign in** with your GitHub account
3. **Click "Clone a repository from the Internet"**
4. **Enter repository URL**: `https://github.com/YOUR_USERNAME/tjhs-sports-rental`
5. **Choose local path**: `C:\Users\ivans\OneDrive\Документы\tjhs-sports-rental`
6. **Click "Clone"**
7. **Copy all your project files** to this folder
8. **In GitHub Desktop**:
   - You'll see all your files listed
   - Add commit message: "Initial commit - TJHS Sports Rental System"
   - Click "Commit to main"
   - Click "Push origin" to upload to GitHub

#### **Option B: Using Command Line**

1. **Open Command Prompt** in your project folder
2. **Run these commands**:
   ```bash
   # Initialize git repository
   git init
   
   # Add all files
   git add .
   
   # Create first commit
   git commit -m "Initial commit - TJHS Sports Rental System"
   
   # Add GitHub repository as remote
   git remote add origin https://github.com/YOUR_USERNAME/tjhs-sports-rental.git
   
   # Push to GitHub
   git push -u origin main
   ```

### **Step 4: Enable GitHub Pages**

1. **Go to your repository** on GitHub
2. **Click "Settings"** tab
3. **Scroll down to "Pages"** section
4. **Under "Source"**, select **"GitHub Actions"**
5. **The workflow will automatically deploy** your site

### **Step 5: Access Your Live Site**

Your site will be available at:
**`https://YOUR_USERNAME.github.io/tjhs-sports-rental`**

## 🔧 **Testing Your Deployment**

### **Test the Live Site**

1. **Visit your live URL**
2. **Test student registration**
3. **Test equipment rental**
4. **Test admin login** (`admin@TJHS` / `admin2025`)
5. **Test mobile view** on your phone

### **Test PWA Features**

1. **Open on mobile device**
2. **Look for "Add to Home Screen"** option
3. **Install the app**
4. **Test offline functionality**

## 🎉 **Success Checklist**

- [ ] GitHub repository created
- [ ] All files uploaded to GitHub
- [ ] GitHub Pages enabled
- [ ] Site is live and accessible
- [ ] Student registration works
- [ ] Equipment rental works
- [ ] Admin login works
- [ ] Mobile view works
- [ ] PWA installation works

## 🚨 **Troubleshooting**

### **If deployment fails:**
1. **Check GitHub Actions** tab for error logs
2. **Ensure repository is public**
3. **Verify all files are uploaded**
4. **Check that GitHub Pages is enabled**

### **If site doesn't load:**
1. **Wait 5-10 minutes** for deployment to complete
2. **Check the URL** is correct
3. **Clear browser cache**
4. **Try incognito/private mode**

### **If features don't work:**
1. **Check browser console** for errors
2. **Ensure JavaScript is enabled**
3. **Try different browser**
4. **Check mobile compatibility**

## 📱 **Mobile Testing**

### **Test on Phone:**
1. **Open the live URL** on your phone
2. **Test the interface** - should be touch-friendly
3. **Try installing** as PWA
4. **Test offline** functionality

### **Test on Tablet:**
1. **Open the live URL** on tablet
2. **Test responsive design**
3. **Verify all features** work properly

## 🔐 **Security Notes**

- **Admin credentials** are hardcoded for demo purposes
- **Data is stored locally** in browser
- **No server-side validation** (client-side only)
- **Suitable for school environment** with supervision

## 📞 **Need Help?**

If you encounter issues:
1. **Check the deployment logs** in GitHub Actions
2. **Review the error messages** carefully
3. **Ensure all steps** were followed correctly
4. **Try the troubleshooting** steps above

## 🎯 **Next Steps**

Once your site is live:
1. **Share the URL** with TJHS students and teachers
2. **Test with real users** to get feedback
3. **Monitor usage** through the admin dashboard
4. **Make improvements** based on feedback

---

**Congratulations! Your TJHS Sports Rental System is now live and ready for use! 🎉**
