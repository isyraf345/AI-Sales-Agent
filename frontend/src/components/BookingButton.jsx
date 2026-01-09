import { Calendar, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { createBooking } from '../services/api';
import { useChat } from '../context/ChatContext';

const BookingButton = () => {
  const { activeConversationId, activeConversation, addMessage, updateBookingStatus } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    requirement: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await createBooking(formData);
      
      // Add system message
      addMessage(activeConversationId, {
        sender: 'system',
        text: '✅ Booking Confirmed! A confirmation email has been sent.',
        timestamp: new Date().toISOString()
      });

      // Update booking status
      updateBookingStatus(activeConversationId, {
        status: 'confirmed',
        details: formData,
        timestamp: new Date().toISOString()
      });

      setShowForm(false);
      setFormData({ name: '', email: '', contact: '', requirement: '' });
    } catch (error) {
      addMessage(activeConversationId, {
        sender: 'system',
        text: '❌ Booking failed. Please try again.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (activeConversation?.bookingStatus?.status === 'confirmed') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <Check className="w-5 h-5" />
          <span className="font-medium">Appointment Booked</span>
        </div>
        <p className="text-sm text-green-600">
          Confirmation email sent to {activeConversation.bookingStatus.details.email}
        </p>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Book Appointment</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <input
            type="tel"
            placeholder="Contact Number"
            required
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <textarea
            placeholder="Your Requirement"
            required
            rows="3"
            value={formData.requirement}
            onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Confirm Booking
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mb-4 shadow-sm"
    >
      <Calendar className="w-5 h-5" />
      <span className="font-medium">Book Appointment</span>
    </button>
  );
};

export default BookingButton;