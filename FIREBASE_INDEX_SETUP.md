# Firebase Index Setup Guide

## 🚨 URGENT: Create These Indexes to Fix Errors

The following Firebase indexes need to be created to fix the query errors you're seeing in the console:

## ⚡ Quick Fix - Click These Links

**IMPORTANT**: Click each link below to automatically create the required indexes:

### 1. Trending Stories Index
**Collection**: `trending_stories`
**Fields**:
- `isActive` (Ascending)
- `language` (Ascending)
- `priority` (Ascending)
- `__name__` (Ascending)

**URL**: https://console.firebase.google.com/v1/r/project/new-project-f8d5e/firestore/indexes?create_composite=Clpwcm9qZWN0cy9uZXctcHJvamVjdC1mOGQ1ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvdHJlbmRpbmdfc3Rvcmllcy9pbmRleGVzL18QARoMCghpc0FjdGl2ZRABGgwKCGxhbmd1YWdlEAEaDAoIcHJpb3JpdHkQAhoMCghfX25hbWVfXxAC

### 2. Videos Index (General)
**Collection**: `videos`
**Fields**:
- `disabled` (Ascending)
- `isAdminPost` (Ascending)
- `language` (Ascending)
- `createdAt` (Ascending)
- `__name__` (Ascending)

**URL**: https://console.firebase.google.com/v1/r/project/new-project-f8d5e/firestore/indexes?create_composite=ClBwcm9qZWN0cy9uZXctcHJvamVjdC1mOGQ1ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvdmlkZW9zL2luZGV4ZXMvXxABGgwKCGRpc2FibGVkEAEaDwoLaXNBZG1pblBvc3QQARoMCghsYW5ndWFnZRABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI

### 3. Videos Index (Code Videos)
**Collection**: `videos`
**Fields**:
- `disabled` (Ascending)
- `isAdminPost` (Ascending)
- `isCodeVideo` (Ascending)
- `featured` (Ascending)
- `createdAt` (Ascending)
- `__name__` (Ascending)

**URL**: https://console.firebase.google.com/v1/r/project/new-project-f8d5e/firestore/indexes?create_composite=ClBwcm9qZWN0cy9uZXctcHJvamVjdC1mOGQ1ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvdmlkZW9zL2luZGV4ZXMvXxABGgwKCGRpc2FibGVkEAEaDwoLaXNBZG1pblBvc3QQARoPCgtpc0NvZGVWaWRlbxABGgwKCGZlYXR1cmVkEAIaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg

### 4. Stories Index
**Collection**: `stories`
**Fields**:
- `disabled` (Ascending)
- `isAdminPost` (Ascending)
- `language` (Ascending)
- `createdAt` (Ascending)
- `__name__` (Ascending)

**URL**: https://console.firebase.google.com/v1/r/project/new-project-f8d5e/firestore/indexes?create_composite=ClFwcm9qZWN0cy9uZXctcHJvamVjdC1mOGQ1ZS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvc3Rvcmllcy9pbmRleGVzL18QARoMCghkaXNhYmxlZBABGg8KC2lzQWRtaW5Qb3N0EAEaDAoIbGFuZ3VhZ2UQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC

## How to Create Indexes

1. **Click on the URLs above** - Each URL will take you directly to the Firebase Console index creation page
2. **Review the index configuration** - Make sure all fields are correct
3. **Click "Create Index"** - Firebase will start building the index
4. **Wait for completion** - Index creation can take a few minutes to several hours depending on data size

## Alternative Method

If the URLs don't work, you can manually create indexes:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `new-project-f8d5e`
3. Navigate to **Firestore Database** > **Indexes**
4. Click **Create Index**
5. Add the fields as specified above for each collection

## Index Status

After creating indexes, you can monitor their status in the Firebase Console. Indexes will show as:
- 🟡 **Building** - Index is being created
- 🟢 **Enabled** - Index is ready to use
- 🔴 **Error** - There was an issue creating the index

## Testing

Once all indexes are created and enabled:
1. Refresh your main website
2. Check the browser console for any remaining Firebase errors
3. Test filtering and searching functionality

## Notes

- Index creation is a one-time setup
- Indexes improve query performance significantly
- All queries will work once indexes are created
- No code changes are needed after index creation
