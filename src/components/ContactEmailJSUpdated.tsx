import { useRef, useState, useEffect } from "react";
import { User, Mail, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidGlassToastCSS } from "./LiquidGlassToastCSS";

declare global {
  interface Window {
    emailjs: any;
  }
}

export function ContactEmailJSUpdated() {
	const form = useRef<HTMLFormElement>(null);
	const [loading, setLoading] = useState(false);
	const [toast, setToast] = useState({
		show: false,
		message: "",
		type: "success" as "success" | "error" | "info"
	});

	useEffect(() => {
		// Initialize EmailJS when component mounts
		const initEmailJS = () => {
			if (window.emailjs) {
				try {
					window.emailjs.init("8HrjK7cb_trVMfQ6g");
					console.log("EmailJS initialized successfully");
				} catch (error) {
					console.error("Error initializing EmailJS:", error);
				}
			}
		};

		if (window.emailjs) {
			initEmailJS();
		} else {
			// Wait for EmailJS to load
			window.addEventListener('load', initEmailJS);
			// Also check periodically
			const checkInterval = setInterval(() => {
				if (window.emailjs) {
					initEmailJS();
					clearInterval(checkInterval);
				}
			}, 100);

			// Cleanup
			return () => {
				window.removeEventListener('load', initEmailJS);
				clearInterval(checkInterval);
			};
		}
	}, []);

	const showToast = (message: string, type: "success" | "error" | "info") => {
		setToast({ show: true, message, type });
	};

	const sendEmail = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!form.current) {
			showToast("Form reference not found", "error");
			return;
		}

		if (!window.emailjs) {
			showToast("Email service is not loaded. Please refresh the page.", "error");
			return;
		}

		setLoading(true);

		try {
			const result = await window.emailjs.sendForm(
				"service_2iu77at",
				"template_cpxlc8r",
				form.current
			);
			
			console.log("EmailJS Response:", result);
			
			if (result.text === "OK" || result.status === 200) {
				showToast("Message sent successfully! We'll get back to you soon.", "success");
				form.current.reset();
			} else {
				showToast("Failed to send message. Please try again.", "error");
			}
		} catch (error: any) {
			console.error("EmailJS Error:", error);
			showToast(
				error?.text || error?.message || "Error sending message. Please try again.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<LiquidGlassToastCSS
				show={toast.show}
				message={toast.message}
				type={toast.type}
				duration={3000}
				onClose={() => setToast({ ...toast, show: false })}
			/>
			
			<div className="bg-card rounded-lg border p-8">
				<h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
				
				<form ref={form} onSubmit={sendEmail} className="space-y-6">
					<div className="space-y-2">
						<label htmlFor="name" className="text-sm font-medium">Full Name</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
								<User className="h-4 w-4" />
							</div>
							<input
								type="text"
								id="name"
								name="name"
								placeholder="Your name"
								required
								className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label htmlFor="email" className="text-sm font-medium">Email Address</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
								<Mail className="h-4 w-4" />
							</div>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="your.email@example.com"
								required
								className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label htmlFor="subject" className="text-sm font-medium">Subject</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
								<FileText className="h-4 w-4" />
							</div>
							<input
								type="text"
								id="subject"
								name="subject"
								placeholder="Message subject"
								required
								className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label htmlFor="message" className="text-sm font-medium">Message</label>
						<textarea
							id="message"
							name="message"
							placeholder="Your message here..."
							rows={5}
							required
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						/>
					</div>

					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="consent"
							required
							className="rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
						/>
						<label htmlFor="consent" className="text-sm text-muted-foreground">
							I consent to having this website store my submitted information so they can respond to my inquiry.
						</label>
					</div>

					<Button type="submit" className="w-full" disabled={loading}>
						<Send className="mr-2 h-4 w-4" />
						{loading ? "Sending..." : "Send Message"}
					</Button>
				</form>
				
				<div className="mt-4 text-xs text-muted-foreground text-center">
					Messages are sent to <span className="font-medium">spaceteam@uma.es</span>
				</div>
			</div>
		</>
	);
}