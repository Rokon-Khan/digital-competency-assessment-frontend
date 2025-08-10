export default function Footer() {
  return (
    <div>
      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Test_School</h3>
              <p className="text-sm text-muted-foreground">
                Empowering digital competency through comprehensive assessment
                and certification.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/quiz"
                    className="hover:text-foreground transition-smooth"
                  >
                    Assessment
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="hover:text-foreground transition-smooth"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/certificates"
                    className="hover:text-foreground transition-smooth"
                  >
                    Certificates
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/help"
                    className="hover:text-foreground transition-smooth"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-foreground transition-smooth"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="hover:text-foreground transition-smooth"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-foreground transition-smooth"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="hover:text-foreground transition-smooth"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="/security"
                    className="hover:text-foreground transition-smooth"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Test_School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
