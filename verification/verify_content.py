from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"BROWSER LOG: {msg.text}"))
        page.on("pageerror", lambda err: print(f"BROWSER ERROR: {err}"))

        # Capture network failures
        def handle_response(response):
            if response.status >= 400:
                print(f"NETWORK ERROR: {response.status} {response.url}")

        page.on("response", handle_response)

        print("1. Visiting Homepage...")
        page.goto("http://localhost:5173")
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/1_homepage_initial.png")

        print("2. Visiting Admin Login...")
        page.goto("http://localhost:5173/admin")
        page.wait_for_timeout(1000)

        # Check if login is needed
        if page.get_by_placeholder("Usuario").count() > 0:
             print("   Logging in...")
             page.get_by_placeholder("Usuario").fill("admin")
             page.get_by_placeholder("Contraseña").fill("admin123")
             page.get_by_role("button", name="Iniciar Sesión").click()
             page.wait_for_url("**/admin")
             page.wait_for_timeout(2000)

        page.screenshot(path="verification/2_admin_dashboard.png")
        print("   Logged in to Admin Dashboard")

        print("3. Navigating to Content Management...")
        page.get_by_text("Contenido Web").click()
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/3_content_management.png")

        print("4. Adding a Partner...")
        import time
        unique_name = f"Playwright Partner {int(time.time())}"

        if page.get_by_role("button", name="Añadir Colaborador").count() > 0:
            page.get_by_role("button", name="Añadir Colaborador").click()
            page.get_by_placeholder("Nombre de la organización").fill(unique_name)
            page.get_by_placeholder("https://...").first.fill("https://playwright.dev/logo.png") # Logo
            page.get_by_placeholder("https://...").last.fill("https://playwright.dev") # URL
            page.get_by_role("button", name="Guardar").click()
            page.wait_for_timeout(1000)

            # Verify in list
            expect(page.get_by_text(unique_name)).to_be_visible()
            page.screenshot(path="verification/4_partner_added.png")
            print(f"   Partner '{unique_name}' added in Admin")
        else:
            print("   Could not find 'Añadir Colaborador' button.")

        print("5. Verifying on Homepage...")
        page.goto("http://localhost:5173")
        page.wait_for_timeout(2000) # Wait for load

        partner_title = page.get_by_text("Our Partners")

        # Force scroll to it
        print("   Scrolling to 'Our Partners'...")
        partner_title.scroll_into_view_if_needed()
        page.evaluate("window.scrollBy(0, 100)")

        page.wait_for_timeout(2000) # Wait for animation

        expect(partner_title).to_be_visible()

        # Check for the added partner
        print(f"   Checking for '{unique_name}'...")
        new_partner = page.get_by_text(unique_name)
        new_partner.scroll_into_view_if_needed()
        page.wait_for_timeout(500)
        expect(new_partner).to_be_visible()

        page.screenshot(path="verification/6_homepage_verified.png")
        print("   Partner visible on Homepage")

        browser.close()

if __name__ == "__main__":
    run()
