import { useRef, useState } from "react";
import { User, Mail, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactFormSimple() {
	const form = useRef<HTMLFormElement>(null);
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const [error, setError] = useState("");

	const sendEmail = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.current) return;

		setLoading(true);
		setSent(false);
		setError("");

		const formData = new FormData(form.current);
		const data = {
			name: formData.get('name'),
			email: formData.get('email'),
			subject: formData.get('subject'),
			message: formData.get('message'),
		};

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (response.ok) {
				setSent(true);
				form.current.reset();
				
				// Alternativa: abrir cliente de correo del usuario
				const mailtoLink = `mailto:spaceteam@uma.es?subject=${encodeURIComponent(data.subject as string)}&body=${encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`)}`;
				window.location.href = mailtoLink;
			} else {
				setError(result.error || "Error sending message. Try again.");
			}
		} catch (err: any) {
			setError("Error sending message. Try again.");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
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

				{sent && <p className="text-green-600 text-sm">Message sent! Your email client will open to complete the sending.</p>}
				{error && <p className="text-red-600 text-sm">{error}</p>}
			</form>
			
			<div className="mt-4 p-4 bg-muted rounded-md">
				<p className="text-sm text-muted-foreground">
					<strong>Note:</strong> This form will open your email client to send the message to <a href="mailto:spaceteam@uma.es" className="text-primary hover:underline">spaceteam@uma.es</a>
				</p>
			</div>
		</div>
	);
}