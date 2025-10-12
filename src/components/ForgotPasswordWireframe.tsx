export function ForgotPasswordWireframe() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-card rounded-3xl shadow-lg my-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
        Forgot Password Flow
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Login Screen */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary border-b-2 border-primary pb-2">
            1. Login Screen
          </h3>

          <div className="bg-accent rounded-2xl p-4 border border-border">
            <div className="space-y-3">
              <div className="bg-card rounded-xl p-3 border border-border">
                <p className="text-sm font-medium">Email Field</p>
                <div className="h-2 bg-muted rounded mt-1"></div>
              </div>
              <div className="bg-card rounded-xl p-3 border border-border">
                <p className="text-sm font-medium">Password Field</p>
                <div className="h-2 bg-muted rounded mt-1"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-muted rounded"></div>
                  <span className="text-xs">Remember me</span>
                </div>
                <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                  Forgot password?
                </div>
              </div>
              <div className="bg-primary/10 rounded-xl p-2 text-center">
                <span className="text-sm text-primary">Sign In Button</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              User clicks "Forgot password?" link
            </p>
          </div>
        </div>

        {/* Step 2: Forgot Password Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary border-b-2 border-secondary pb-2">
            2. Reset Form
          </h3>

          <div className="bg-accent rounded-2xl p-4 border border-border">
            <div className="space-y-3">
              <div className="text-center mb-4">
                <h4 className="font-medium text-secondary">Reset Your Password</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter email for reset link
                </p>
              </div>

              <div className="bg-card rounded-xl p-3 border border-border">
                <p className="text-sm font-medium">Email Address</p>
                <div className="h-2 bg-muted rounded mt-1"></div>
              </div>

              <div className="bg-secondary/10 rounded-xl p-2 text-center">
                <span className="text-sm text-secondary">Send Reset Link</span>
              </div>

              <div className="text-center">
                <div className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                  ← Back to Login
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              User submits email address
            </p>
          </div>
        </div>

        {/* Step 3: Confirmation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple border-b-2 border-purple pb-2">
            3. Confirmation
          </h3>

          <div className="bg-accent rounded-2xl p-4 border border-border">
            <div className="space-y-3">
              <div className="bg-purple/10 rounded-xl p-4 text-center border border-purple">
                <div className="w-12 h-12 bg-purple/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-purple text-xl">✓</span>
                </div>
                <h4 className="font-medium text-purple mb-1">Email Sent!</h4>
                <p className="text-xs text-muted-foreground">
                  Check your inbox for reset link
                </p>
              </div>

              <div className="text-center">
                <div className="bg-card border border-border rounded-xl p-2">
                  <span className="text-sm">Return to Login</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              User returns to login screen
            </p>
          </div>
        </div>
      </div>

      {/* Complete Flow */}
      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="text-xl font-semibold text-center mb-6 text-purple">
          Complete Forgot Password Journey
        </h3>

        <div className="flex flex-wrap justify-center gap-4 items-center">
          <div className="bg-card border border-border rounded-xl px-4 py-2 shadow-sm">
            <span className="text-sm">User on Login</span>
          </div>
          <span className="text-2xl text-muted-foreground">→</span>
          <div className="bg-primary/10 border border-primary rounded-xl px-4 py-2">
            <span className="text-sm text-primary">Click "Forgot Password"</span>
          </div>
          <span className="text-2xl text-muted-foreground">→</span>
          <div className="bg-secondary/10 border border-secondary rounded-xl px-4 py-2">
            <span className="text-sm text-secondary">Enter Email</span>
          </div>
          <span className="text-2xl text-muted-foreground">→</span>
          <div className="bg-purple/10 border border-purple rounded-xl px-4 py-2">
            <span className="text-sm text-purple">Email Sent</span>
          </div>
          <span className="text-2xl text-muted-foreground">→</span>
          <div className="bg-card border border-border rounded-xl px-4 py-2 shadow-sm">
            <span className="text-sm">Back to Login</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/5 rounded-2xl p-4 text-center">
          <h4 className="font-medium text-primary mb-2">Seamless Navigation</h4>
          <p className="text-xs text-muted-foreground">
            Easy transition between login and forgot password without losing context
          </p>
        </div>
        <div className="bg-secondary/5 rounded-2xl p-4 text-center">
          <h4 className="font-medium text-secondary mb-2">Clear Instructions</h4>
          <p className="text-xs text-muted-foreground">
            User-friendly messaging explains each step of the password reset process
          </p>
        </div>
        <div className="bg-purple/5 rounded-2xl p-4 text-center">
          <h4 className="font-medium text-purple mb-2">Confirmation Feedback</h4>
          <p className="text-xs text-muted-foreground">
            Visual confirmation when reset email is sent with next steps
          </p>
        </div>
      </div>

      {/* Mock Email Preview */}
      <div className="mt-8 pt-8 border-t border-border">
        <h3 className="text-lg font-semibold text-center mb-4 text-foreground">
          Reset Email Preview
        </h3>

        <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-primary rounded-full"></div>
              <span className="font-medium text-secondary">Mutopia</span>
            </div>
            <h4 className="font-medium">Reset Your Password</h4>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Hi there,</p>
            <p>We received a request to reset your password for your Mutopia account.</p>
            <div className="bg-primary/10 rounded-xl p-3 text-center">
              <span className="text-primary font-medium">Reset My Password</span>
            </div>
            <p className="text-xs">This link will expire in 24 hours for security.</p>
            <p className="text-xs">If you didn't request this, you can safely ignore this email.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
