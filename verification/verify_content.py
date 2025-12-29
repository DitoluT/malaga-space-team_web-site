from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"BROWSER LOG: {msg.text}"))

        # Capture network failures
        def handle_response(response):
            if response.status >= 400:
                print(f"NETWORK ERROR: {response.status} {response.url}")

        page.on("response", handle_response)

        print("1. Logging into Admin...")
        page.goto("http://localhost:5173/admin")
        page.wait_for_timeout(1000)

        if page.get_by_placeholder("Usuario").count() > 0:
             page.get_by_placeholder("Usuario").fill("admin")
             page.get_by_placeholder("Contraseña").fill("admin123")
             page.get_by_role("button", name="Iniciar Sesión").click()
             page.wait_for_url("**/admin")
             page.wait_for_timeout(2000)

        print("   Logged in.")

        print("2. Content Management...")
        page.get_by_text("Contenido Web").click()
        page.wait_for_timeout(1000)

        # --- SPONSOR ---
        print("3. Adding Sponsor...")
        page.get_by_role("button", name="Colaboradores (Detalle)").click()

        unique_sponsor = f"Test Sponsor {int(time.time())}"

        page.get_by_role("button", name="Añadir Patrocinador").click()
        page.get_by_placeholder("Nombre del Patrocinador").fill(unique_sponsor)
        page.get_by_placeholder("Ej: Colaborador Principal").fill("Strategic Partner")
        page.get_by_placeholder("Descripción del patrocinador...").fill("Testing description for sponsor.")
        page.get_by_role("button", name="Guardar").click()
        page.wait_for_timeout(1000)

        expect(page.get_by_text(unique_sponsor)).to_be_visible()
        print(f"   Sponsor '{unique_sponsor}' added.")

        # --- TEAM MEMBER ---
        print("4. Adding Team Member...")
        page.get_by_role("button", name="Equipo").click()

        unique_member = f"Test Member {int(time.time())}"

        page.get_by_role("button", name="Añadir Miembro").click()
        page.get_by_placeholder("Nombre Completo").fill(unique_member)
        page.get_by_placeholder("Ej: Ingeniero de Software").fill("Test Engineer")
        page.get_by_role("button", name="Guardar").click()
        page.wait_for_timeout(1000)

        # Verify in list (might need to check "Miembro" section)
        expect(page.get_by_text(unique_member)).to_be_visible()
        print(f"   Team Member '{unique_member}' added.")

        print("5. Verifying on Homepage...")
        page.goto("http://localhost:5173")
        page.wait_for_timeout(2000)

        # Verify Sponsor
        print("   Checking Sponsor...")
        # Force scroll to Sponsors section
        sponsor_loc = page.get_by_text(unique_sponsor)
        sponsor_loc.scroll_into_view_if_needed()
        expect(sponsor_loc).to_be_visible()
        print("   Sponsor visible.")

        # Verify Team Member (in Modal)
        print("   Checking Team Member...")
        # Click button inside #equipo section (first button is usually Tree Modal)
        print("   Opening Team Modal...")
        page.locator("#equipo button").first.click()

        # Wait for modal
        page.wait_for_timeout(1000)

        # Check member
        member_loc = page.get_by_text(unique_member)
        member_loc.scroll_into_view_if_needed()
        expect(member_loc).to_be_visible()
        print("   Team Member visible in modal.")

        page.screenshot(path="verification/7_final_verification.png")

        browser.close()

if __name__ == "__main__":
    run()
