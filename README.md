# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

### Routes

#### Guest Routes

- [x] `GET  /register` : Show register form [RegisteredUserController@create]
- [x] `POST /register` : Handle registration [RegisteredUserController@store]
- [x] `GET  /login` : Show login form [AuthenticatedSessionController@create]
- [x] `POST /login` : Handle login [AuthenticatedSessionController@store]
- [ ] `GET  /forgot-password` : Show password reset form [PasswordResetLinkController@create]
- [ ] `POST /forgot-password` : Send password reset link [PasswordResetLinkController@store]
- [ ] `GET  /reset-password/{token}` : Show new password form [NewPasswordController@create]
- [ ] `POST /reset-password` : Reset password [NewPasswordController@store]

#### Authenticated Routes

- [ ] `GET  /verify-email` : Show email verification prompt [EmailVerificationPromptController]
- [ ] `GET  /verify-email/{id}/{hash}` : Verify email [VerifyEmailController]
- [ ] `POST /email/verification-notification` : Resend verification email [EmailVerificationNotificationController@store]
- [ ] `GET  /confirm-password` : Show confirm password view [ConfirmablePasswordController@show]
- [ ] `POST /confirm-password` : Confirm password [ConfirmablePasswordController@store]
- [ ] `PUT  /password` : Update password [PasswordController@update]
- [ ] `POST /logout` : Logout [AuthenticatedSessionController@destroy]

#### Profile Routes (authenticated)

- [ ] `GET    /profile` : Show profile edit form [ProfileController@edit]
- [ ] `PATCH  /profile` : Update profile information [ProfileController@update]
- [ ] `DELETE /profile` : Delete user profile [ProfileController@destroy]
