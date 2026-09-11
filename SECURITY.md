# Security Policy

This document explains how to report a security vulnerability in Sunbird Spark Portal.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities — this can expose an exploitable issue before a fix is available.

Instead, report it privately through GitHub's vulnerability reporting flow:

1. Go to the [Security tab](https://github.com/Sunbird-Spark/sunbird-spark-portal/security) of this repository
2. Click **"Report a vulnerability"**
3. Fill in as much detail as you can: affected component, steps to reproduce, and potential impact

<!-- Maintainers: this flow requires "Private vulnerability reporting" to be enabled under
     Settings → Security in the upstream repo. It is not on by default. -->

## What to Expect

We aim to acknowledge new reports within a few business days. Once a report is confirmed, we'll work on a fix and coordinate disclosure timing with the reporter before any public details are shared.

## Scope

This policy covers the code in this repository — the `frontend/` and `backend/` applications and their build/deploy configuration. Vulnerabilities in third-party dependencies should ideally also be reported here so we can track and update them, even if the fix ultimately needs to land upstream in that dependency.
