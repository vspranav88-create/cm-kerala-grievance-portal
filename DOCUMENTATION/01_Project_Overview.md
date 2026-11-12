# 01 — Project Overview

## Problem statement

Citizens need a clear way to submit public-service grievances, receive a reference number, and follow progress. Government review teams need a shared workflow to triage complaints, assign them to departments, record actions and communicate outcomes.

## Objectives

- Provide an accessible public portal for grievance submission and tracking.
- Give the Chief Minister's Office (CMO) a central review and assignment workflow.
- Let department officers update progress and submit action-taken reports.
- Keep an auditable history of grievance status and staff actions.
- Offer optional AI classification suggestions while preserving human review.

## Scope

This is a recruitment demonstration prototype, not a production government service. It supports sample department data and fictional demo accounts. It does not provide government identity verification, notifications by SMS/email, integration with official department systems, or persistent object storage for uploaded files.

## Features

### Public visitors

- Read portal information, workflow, department directory and FAQ.
- View public aggregate statistics.
- Submit an enquiry through Contact Us.
- Track a grievance by its reference number with limited public information.

### Citizens

- Register and sign in.
- Optionally request AI suggestions for complaint department, category, priority and summary.
- Submit a grievance with district, category, subject, description and optional JPG/PNG/PDF attachment (up to 5 MB).
- View their own grievances, history, status, feedback and reopen a resolved complaint.

### CMO administrators

- Review grievances and dashboard statistics.
- Assign a department and optional department officer.
- Set status, add internal remarks, escalate, and review action reports.

### Department officers

- See grievances assigned to their department.
- Update progress to In Progress and submit an action-taken report for CMO review.

## Main roles and lifecycle

Roles are `citizen`, `cmo`, and `officer`. Citizens submit grievances; CMO staff review and route them; department officers report actions; CMO staff review the report and resolve or return the case. The citizen may then submit feedback or reopen a resolved grievance.
