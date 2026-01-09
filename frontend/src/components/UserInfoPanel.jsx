import { useChat } from '../context/ChatContext';
import { User, Mail, Phone, FileText, Calendar, X } from 'lucide-react';
import clsx from 'clsx';

const UserInfoPanel = ({ isOpen, onClose }) => {
  const { activeConversation } = useChat();

  if (!activeConversation) return null;

  const { bookingStatus, intent } = activeConversation;

  return (
    <div className={clsx(
      "bg-white border-l border-gray-200 h-full flex flex-col",
      "lg:w-80",
      isOpen ? "absolute lg:relative w-80 right-0 z-50 shadow-lg lg:shadow-none" : "hidden lg:flex"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Details</h2>
        <button
          onClick={onClose}
          className="lg:hidden p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Intent Info */}
        {intent && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Intent Analysis</h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className={clsx(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  intent.type === 'SALES' 
                    ? "bg-green-100 text-green-700" 
                    : "bg-blue-100 text-blue-700"
                )}>
                  {intent.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Confidence:</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(intent.confidence * 100)}%
                </span>
              </div>
              {intent.confidence > 0.8 && intent.type === 'SALES' && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="text-lg">🔥</span>
                    <span className="text-xs font-medium">Hot Lead</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Information */}
        {bookingStatus && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Booking Details</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium text-sm">Appointment Confirmed</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {bookingStatus.details.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">
                      {bookingStatus.details.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm text-gray-900">
                      {bookingStatus.details.contact}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Requirement</p>
                    <p className="text-sm text-gray-900">
                      {bookingStatus.details.requirement}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-green-200">
                <p className="text-xs text-green-600">
                  Booked on {new Date(bookingStatus.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!intent && !bookingStatus && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No details yet</p>
            <p className="text-xs mt-1">Start chatting to see information here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoPanel;