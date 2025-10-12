export function AuthWireframe() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-card rounded-3xl shadow-lg my-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
        Authentication Flow Wireframe
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Login Flow */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-primary border-b-2 border-primary pb-2">
            Login Flow
          </h3>

          <div className="space-y-4">
            <div className="bg-accent rounded-2xl p-4 border border-border">
              <h4 className="font-medium mb-2">1. Trigger Point</h4>
              <p className="text-sm text-muted-foreground">
                User clicks "Login / Sign Up" in header navigation
              </p>
            </div>

            <div className="bg-accent rounded-2xl p-4 border border-border">
              <h4 className="font-medium mb-2">2. Modal Opens</h4>
              <p className="text-sm text-muted-foreground">
                Auth dialog displays with tabs for Login/Sign Up
              </p>
            </div>

            <div className="bg-accent rounded-2xl p-4 border border-border">
              <h4 className="font-medium mb-2">3. OAuth Options</h4>
              <div className="flex gap-2 mt-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-xl text-xs">
                  Google OAuth
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-xl text-xs">
                  Facebook OAuth
                </div>
              </div>
            </div>

            <div className="bg-accent rounded-2xl p-4 border border-border">
              <h4 className="font-medium mb-2">4. Email/Password</h4>
              <p className="text-sm text-muted-foreground">
                Traditional email and password form with "Remember me" option
              </p>
            </div>

            <div className="bg-primary/10 rounded-2xl p-4 border border-primary">
              <h4 className="font-medium mb-2 text-primary">5. Success</h4>
              <p className="text-sm text-muted-foreground">
                User authenticated, modal closes, return to main site
              </p>
            </div>
          </div>
        </div>

        {/* Sign Up Flow */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-secondary border-b-2 border-secondary pb-2">
            Sign Up Flow
          </h3>

          <div className="space-y-4">
            <div className="bg-accent rounded-2xl p-4 border border-border">
              <h4 className="font-medium mb-2">1. Same Trigger</h4>
              <p className="text-sm text-muted-foreground">
                Same "Login / Sign Up" button, but user selects Sign Up tab
              </p>
            </div>

            <div className="bg-accent rounded-2xl p-4 border border-border">
              <h4 className="font-medium mb-2">2. OAuth Quick Sign Up</h4>
              <div className="flex gap-2 mt-2">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-xl text-xs">
                  Google Sign Up
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-xl text-xs">
                  Facebook Sign Up
                </div>
              </div>
            </div>

            <div className="bg-accent rounded-2xl p-4 border border-border">
              <h4 className="font-medium mb-2">3. Extended Form</h4>
              <p className="text-sm text-muted-foreground">
                First/Last name, email, password, confirm password
              </p>
            </div>

            <div className="bg-accent rounded-2xl p-4 border border-border">
              <h4 className="font-medium mb-2">4. Terms Agreement</h4>
              <p className="text-sm text-muted-foreground">
                Required checkbox for Terms of Service & Privacy Policy
              </p>
            </div>

            <div className="bg-secondary/10 rounded-2xl p-4 border border-secondary">
              <h4 className="font-medium mb-2 text-secondary">5. Account Created</h4>
              <p className="text-sm text-muted-foreground">
                New account created, user authenticated and returned to site
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Journey */}
      <div className="mt-12 pt-8 border-t border-border">
        <h3 className="text-xl font-semibold text-center mb-6 text-purple">
          Complete User Journey
        </h3>

        <div className="flex flex-wrap justify-center gap-4 items-center">
          <div className="bg-card border border-border rounded-xl px-4 py-2 shadow-sm">
            <span className="text-sm">Browse Landing Page</span>
          </div>
          <span className="text-2xl text-muted-foreground">→</span>
          <div className="bg-primary/10 border border-primary rounded-xl px-4 py-2">
            <span className="text-sm text-primary">Click Login/Sign Up</span>
          </div>
          <span className="text-2xl text-muted-foreground">→</span>
          <div className="bg-secondary/10 border border-secondary rounded-xl px-4 py-2">
            <span className="text-sm text-secondary">Choose Auth Method</span>
          </div>
          <span className="text-2xl text-muted-foreground">→</span>
          <div className="bg-purple/10 border border-purple rounded-xl px-4 py-2">
            <span className="text-sm text-purple">Authenticated User</span>
          </div>
          <span className="text-2xl text-muted-foreground">→</span>
          <div className="bg-card border border-border rounded-xl px-4 py-2 shadow-sm">
            <span className="text-sm">Book Appointment</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/5 rounded-2xl p-4 text-center">
          <h4 className="font-medium text-primary mb-2">OAuth Integration</h4>
          <p className="text-xs text-muted-foreground">Google & Facebook authentication for quick access</p>
        </div>
        <div className="bg-secondary/5 rounded-2xl p-4 text-center">
          <h4 className="font-medium text-secondary mb-2">Traditional Forms</h4>
          <p className="text-xs text-muted-foreground">Email/password option for users who prefer standard signup</p>
        </div>
        <div className="bg-purple/5 rounded-2xl p-4 text-center">
          <h4 className="font-medium text-purple mb-2">Brand Consistency</h4>
          <p className="text-xs text-muted-foreground">Curved design elements and Mutopia brand colors throughout</p>
        </div>
      </div>
    </div>
  );
}
