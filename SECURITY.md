# Security Policy

## Supported Versions

This project is provided as-is.  
There is currently no long-term support policy or versioned security maintenance.

## Reporting a Vulnerability

If you discover a security vulnerability in **PDF QuickCheck**, please report it responsibly.

**Please do not disclose security issues publicly before coordination.**

### How to Report

Send an email to:

**mail@example.com**

Include:
- A clear description of the issue
- Steps to reproduce (if applicable)
- Affected browser(s) and version(s)
- Example files (if safe to share)

### What to Expect

- You will receive an acknowledgment within a reasonable timeframe
- The issue will be evaluated and, if confirmed, addressed as appropriate
- Credit for responsible disclosure can be provided upon request

## Scope

This project:
- Runs entirely client-side
- Does not process server-side data
- Does not store or transmit files

Security considerations mainly apply to:
- Client-side parsing logic
- Browser API usage
- Potential denial-of-service vectors via crafted files

## Disclaimer

PDF QuickCheck is a **static analysis and inspection tool**.  
It is **not a malware sandbox** and does not guarantee detection of malicious content.

Always combine this tool with:
- Dynamic analysis
- Updated endpoint protection
- Organizational security processes
