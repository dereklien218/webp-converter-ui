# WebP Converter

## Backend API
This project uses a separate API for image conversion:
https://github.com/dereklien218/webp-converter-api

## Live Demo
View a live demo here:
https://webp-converter-ui-one.vercel.app/

## Overview
I built a full-stack image conversion tool that transforms GIFs and static images into optimized WebP files, focusing on performance, usability, and real-world deployment constraints.

## Problem
Large GIFs and images significantly impact web performance. Many existing tools are either bloated or lack a simple, fast workflow for quick conversions.

## Solution
I designed a streamlined interface that allows users to:

- Drag and drop files for quick upload
- Adjust compression quality in real time
- Instantly download optimized WebP files

The experience minimizes friction between upload and result.

## Technical Approach

- Frontend built with Next.js and Tailwind CSS
- Backend API built with Node.js and Express
- Integrated native WebP tooling (gif2webp) for high-quality animated conversion
- Deployed frontend on Vercel and backend on Render

## Key Challenge
Serverless platforms do not support native binaries like gif2webp. To solve this, I containerized the backend using Docker, enabling reliable execution of native image processing tools in production.

## Outcome
The final product is a fast, accessible tool that demonstrates:

- Full-stack architecture
- Deployment strategy across multiple platforms
- Handling of native dependencies in cloud environments
