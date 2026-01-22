# Refresh Token Implementation

## Overview

This application implements an automatic token refresh mechanism to maintain user sessions seamlessly. When the access token expires, the system automatically requests a new one using the refresh token without requiring the user to log in again.

## How It Works

### 1. **Axios Interceptor** (`src/app/utils/axiosInstance.ts`)

- **Request Interceptor**: Automatically attaches the access token to every API request
- **Response Interceptor**: Detects 401 (Unauthorized) errors and triggers token refresh
- **Request Queuing**: Queues failed requests during token refresh and retries them with the new token

### 2. **Token Refresh Flow**

```
1. API Request → 401 Error (Token Expired)
2. Interceptor catches the error
3. Calls /refresh-token endpoint with refresh token
4. Receives new access_token and refresh_token
5. Updates Redux store with new tokens
6. Retries the original failed request
7. Returns response to the caller
```

### 3. **Key Features**

- ✅ **Automatic Token Refresh**: No manual intervention required
- ✅ **Request Queuing**: Multiple simultaneous requests are handled correctly
- ✅ **Single Refresh**: Prevents multiple refresh attempts for concurrent requests
- ✅ **Automatic Logout**: Logs out user if refresh token is invalid or expired
- ✅ **Seamless UX**: Users don't experience interruptions

## Implementation Details

### Axios Instance Configuration

```typescript
// All API calls should use this instance
import axiosInstance from "@/src/app/utils/axiosInstance";

// Example usage
const response = await axiosInstance.get("/api/endpoint");
```

### RTK Query Integration

The `authApi.ts` has been updated to use a custom `axiosBaseQuery` that leverages the axios instance with refresh token support. All RTK Query endpoints automatically benefit from this.

### Token Storage

Tokens are stored in:

- **Redux Store**: For runtime access
- **LocalStorage**: For persistence across page refreshes

### Backend Requirements

Your backend must implement a `/refresh-token` endpoint that:

- Accepts: `{ refresh_token: string }`
- Returns: `{ access_token: string, refresh_token: string }`
- Validates the refresh token
- Issues a new access token (and optionally a new refresh token)

## Security Considerations

1. **Refresh Token Expiry**: Refresh tokens should have a longer expiry (e.g., 7 days) than access tokens (e.g., 15 minutes)
2. **Secure Storage**: Consider using httpOnly cookies for refresh tokens in production
3. **Token Rotation**: Backend should issue new refresh tokens on each refresh to prevent token reuse
4. **Logout on Failure**: System automatically logs out users if refresh fails

## Usage in Components

### Using with RTK Query

```typescript
// No changes needed - automatic token refresh
const { data, error } = useGetUserDataQuery();
```

### Using with Direct Axios Calls

```typescript
import axiosInstance from "@/src/app/utils/axiosInstance";

const fetchData = async () => {
  try {
    const response = await axiosInstance.get("/api/data");
    return response.data;
  } catch (error) {
    // Token refresh is handled automatically
    console.error(error);
  }
};
```

## Testing the Implementation

1. **Login** to get tokens
2. **Wait** for access token to expire (or manually set a short expiry)
3. **Make an API call** - should automatically refresh and succeed
4. **Check Redux DevTools** - verify new tokens are stored
5. **Invalidate refresh token** - should automatically logout

## Troubleshooting

### Issue: Infinite refresh loop

**Solution**: Ensure the `/refresh-token` endpoint doesn't require authentication

### Issue: User logged out unexpectedly

**Solution**: Check if refresh token is expired or backend is returning errors

### Issue: Multiple refresh attempts

**Solution**: The `isRefreshing` flag should prevent this - check implementation

## Future Enhancements

- [ ] Add refresh token rotation
- [ ] Implement sliding session expiry
- [ ] Add token refresh countdown UI indicator
- [ ] Move refresh token to httpOnly cookies
- [ ] Add refresh token blacklisting on logout
