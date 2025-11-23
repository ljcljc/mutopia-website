import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyBookings, type BookingOut } from "@/lib/api";
import { useAuthStore } from "@/components/auth/authStore";
import { toast } from "sonner";
import { HttpError } from "@/lib/http";

export default function Booking() {
  const user = useAuthStore((state) => state.user);
  const [bookings, setBookings] = useState<BookingOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const bookingsData = await getMyBookings();
        setBookings(bookingsData);
      } catch (err) {
        console.error("Failed to load booking data:", err);
        if (err instanceof HttpError) {
          toast.error(err.message || "Failed to load booking data.");
        } else {
          toast.error("Failed to load booking data. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-[#633479] mb-4">Please Log In</h1>
          <p className="text-gray-600">You need to be logged in to view your bookings.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#633479]"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#633479] mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-[#de6a07] text-white rounded-full hover:bg-[#c55f06] transition-colors"
            >
              Book a Service
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[#633479] mb-2">
                        Booking #{booking.id}
                      </h3>
                      {booking.scheduled_time && (
                        <p className="text-gray-600">
                          Scheduled: {new Date(booking.scheduled_time).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Deposit</p>
                      <p className="text-lg font-semibold text-[#633479]">
                        ${typeof booking.deposit_amount === "string" ? booking.deposit_amount : booking.deposit_amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Final Amount</p>
                      <p className="text-lg font-semibold text-[#633479]">
                        ${typeof booking.final_amount === "string" ? booking.final_amount : booking.final_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

