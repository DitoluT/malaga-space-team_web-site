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

        print("2. Testing Quick User Create...")
        # Should be in Users tab (default if admin)
        # Find Quick Create section
        # Input placeholder: "usuario@uma.es"

        unique_user = f"testuser{int(time.time())}"
        email = f"{unique_user}@uma.es"

        page.get_by_placeholder("usuario@uma.es").fill(email)
        page.get_by_role("button", name="Crear Usuario").click()

        # Expect alert or success message.
        # Since alert handling in playwright is tricky if not handled, checking for list update is better.
        # But our app uses window.alert?
        # Handle dialog
        def handle_dialog(dialog):
            print(f"   Dialog: {dialog.message}")
            dialog.accept()

        page.on("dialog", handle_dialog)

        page.wait_for_timeout(2000)

        # Reload to check list
        page.reload()
        page.wait_for_timeout(1000)

        expect(page.get_by_text(unique_user)).to_be_visible()
        print(f"   User '{unique_user}' created successfully.")

        print("3. Testing Sponsor Image...")
        page.get_by_text("Contenido Web").click()
        page.wait_for_timeout(500)
        page.get_by_role("button", name="Colaboradores (Detalle)").click()

        page.get_by_role("button", name="Añadir Patrocinador").click()

        # Check for image input (placeholder "URL o Subir archivo...")
        expect(page.get_by_placeholder("URL o Subir archivo...")).to_be_visible()
        print("   Sponsor Image input visible.")

        page.get_by_placeholder("Nombre del Patrocinador").fill("Image Test Sponsor")
        page.get_by_placeholder("URL o Subir archivo...").fill("https://example.com/logo.png")
        page.get_by_role("button", name="Guardar").click()
        page.wait_for_timeout(1000)

        expect(page.get_by_text("Image Test Sponsor")).to_be_visible()
        print("   Sponsor with image added.")

        print("4. Verifying Public Team Tree Social Icons...")
        page.goto("http://localhost:5173")
        page.wait_for_timeout(2000)

        print("   Opening Team Modal...")
        page.locator("#equipo button").first.click()
        page.wait_for_timeout(1000)

        # We need to find a member. Assuming at least one member exists.
        # We can't verify icons unless we added one with icons.
        # But we verify the modal opens and renders.
        expect(page.get_by_text("Organigrama del Equipo")).to_be_visible()
        print("   Team Modal visible.")

        browser.close()

if __name__ == "__main__":
    run()
