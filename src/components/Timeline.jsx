import React from "react";
import { fetchTimeline } from "../backend/Timeline";

const Timeline = ({ search }) => {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    // Pass search as an object property.
    fetchTimeline({ subject: search || 'generative ai' })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching timeline:", error);
        setLoading(false);
      });
    
    console.log("fetching timeline for", search);
  }, [search]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Timeline</h2>
        <p>Loading timeline...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Timeline</h2>

      {events.map((event, index) => (
        <div key={index}>
          {/* Heading (If it's the first event OR date changes) */}
          {index === 0 || event.date !== events[index - 1].date ? (
            <div className="ps-2 my-2 first:mt-0">
              <h3 className="text-xs font-medium uppercase text-gray-500">
                {event.date}
              </h3>
            </div>
          ) : null}

          {/* Timeline Item */}
          <div className="flex gap-x-3">
            {/* Icon */}
            <div className="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
              <div className="relative z-10 size-7 flex justify-center items-center">
                <div className="size-2 rounded-full bg-gray-400"></div>
              </div>
            </div>

            {/* Right Content */}
            <div className="grow pt-0.5 pb-8">
              <h3 className="flex gap-x-1.5 font-semibold text-gray-800">
                {event.title}
              </h3>
              {event.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {event.description}
                </p>
              )}

              {event.author && (
                <button
                  type="button"
                  className="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  {event.avatar ? (
                    <img
                      className="shrink-0 size-4 rounded-full"
                      src={event.avatar}
                      alt={event.author}
                    />
                  ) : (
                    <span className="flex shrink-0 justify-center items-center size-4 bg-white border border-gray-200 text-[10px] font-semibold uppercase text-gray-600 rounded-full">
                      {event.author.charAt(0)}
                    </span>
                  )}
                  {event.author}
                </button>
              )}
            </div>
          </div>
          {/* End Timeline Item */}
        </div>
      ))}
    </div>
  );
};

export default Timeline;
