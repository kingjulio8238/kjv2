import { useState } from 'react';

const categories = [
    { value: 'press', label: 'PRESS INQUIRY' },
    { value: 'speaking', label: 'SPEAKING ENGAGEMENT' },
    { value: 'investment', label: 'INVESTMENT OPPORTUNITY' },
    { value: 'partnership', label: 'PARTNERSHIP' },
    { value: 'other', label: 'OTHER' },
];

export default function ContactPage() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('https://formsubmit.co/ajax/juliansaks@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    category: selectedCategory || 'Not specified',
                    message: formData.message,
                    _subject: `New contact from ${formData.name}`,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setIsSubmitted(true);
                setFormData({ name: '', email: '', message: '' });
                setSelectedCategory(null);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="contact-page active" id="contactPage">
            <div className="contact-layout">
                <div className="contact-left">
                    <h1 className="contact-heading">
                        GET IN<br />TOUCH
                    </h1>
                </div>
                {isSubmitted ? (
                    <div className="contact-form" style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{
                            fontFamily: 'var(--font-headline)',
                            fontWeight: 700,
                            fontSize: 'clamp(28px, 3.2vw, 52px)',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.025em',
                        }}>
                            THANK YOU
                        </p>
                    </div>
                ) : (
                    <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
                        <div className="contact-input-group">
                            <input
                                className="contact-input"
                                type="text"
                                name="name"
                                placeholder="FULL NAME"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="contact-input-group">
                            <input
                                className="contact-input"
                                type="email"
                                name="email"
                                placeholder="EMAIL"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="contact-categories" id="contactCategories">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    className={`contact-category ${selectedCategory === cat.value ? 'selected' : ''}`}
                                    onClick={() => setSelectedCategory(cat.value)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                        <textarea
                            className="contact-textarea"
                            name="message"
                            placeholder="Message"
                            rows="6"
                            value={formData.message}
                            onChange={handleInputChange}
                        />
                        <button type="submit" className="contact-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'SENDING...' : 'SUBMIT'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
