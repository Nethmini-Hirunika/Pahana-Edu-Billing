# PahanaEdu Billing System

This repository contains the source code and documentation for the PahanaEdu Billing System.  
It is developed using Java Spring Boot (backend), SQL Server (database), and React with Vite (frontend).  
The purpose of this project is to demonstrate software project version control, GitHub workflows, and CI/CD integration as part of the LO III assignment.


## Features
- Customer account management (add, edit, delete)
- Item management with stock control
- Billing calculation and validation
- Automatic inventory update after billing
- PDF invoice generation
- React-based frontend for user interface
- Deployed frontend using GitHub Pages

CI/CD Workflow
The project leverages GitHub Actions to automate the build, test, and deployment process. This ensures that every change pushed to the repository is validated and, upon successful completion, automatically deployed. This workflow is crucial for maintaining a high standard of quality and enabling rapid, continuous delivery of new features.



## Technology Stack
- Backend: Java Spring Boot, Maven, SQL Server
- Frontend: React, Vite, Tailwind CSS
- CI/CD: GitHub Actions
- Deployment: GitHub Pages
- Version Control: Git, Git

About GitHub Pages Deployment
The frontend of the PahanaEdu Billing System is deployed using GitHub Pages. This service hosts the static website files directly from a GitHub repository, providing a simple and effective way to publish the React-based user interface. The CI/CD workflow automatically builds the frontend and pushes the compiled static assets to a dedicated branch (e.g., gh-pages), which GitHub Pages then serves to the public. This eliminates the need for a separate hosting provider for the frontend and streamlines the deployment process.
Live deployment via GitHub Pages.
