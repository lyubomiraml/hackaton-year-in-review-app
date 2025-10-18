import { ChevronLeft, ChevronRight, Sparkles, Upload, X } from "lucide-react";
import { useState } from "react";

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const lifeEvents = [
    "Started a new job",
    "Got an apartment",
    "Got engaged",
    "Got married",
    "Had a baby",
    "Got a psychologist",
    "Got a pet",
    "Started a company",
    "Quit smoking",
    "Quit drinking",
    "Got a car",
    "Got a driving license",
    "Graduated university",
    "Started a side hustle",
    "Completed a course",
    "Repaid a loan",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const questions = [
    {
      id: "dates",
      type: "number",
      question: "How many dates did you go on?",
      category: "Romance",
      max: 100,
    },
    {
      id: "breakups",
      type: "number",
      question: "How many breakups did you have?",
      category: "Romance",
      max: 100,
    },
    {
      id: "relationships",
      type: "number",
      question: "How many relationships did you have?",
      category: "Romance",
      max: 100,
    },
    {
      id: "funThings",
      type: "text-photo",
      question: "Fun things you did in a relationship?",
      category: "Romance",
    },
    {
      id: "worstThings",
      type: "text-photo",
      question: "Worst things you did in a relationship?",
      category: "Romance",
    },
    {
      id: "datingStory",
      type: "text-photo",
      question: "🚩 Craziest dating story time 🚩",
      category: "Romance",
      redFlag: true,
    },
    {
      id: "lifeEvents",
      type: "multi-select",
      question: "What major life events happened?",
      category: "Life Events",
      options: lifeEvents,
      suggestion: "Select as many as you like",
    },
    {
      id: "lifeEventsDetails",
      type: "life-events-details",
      question: "Tell us more about your life events",
      category: "Life Events",
    },
    {
      id: "trips",
      type: "monthly-trips",
      question: "Where did you travel to?",
      category: "Trips",
    },
    {
      id: "hobbies",
      type: "text",
      question: "Hobbies started this year:",
      category: "Hobbies",
    },
    {
      id: "yearHighlight",
      type: "text-photo",
      question:
        "What do you feel highlighted your year? - Something else you want to share.",
      category: "Highlights",
    },
    {
      id: "partying",
      type: "number",
      question: "Went partying 🎉",
      category: "Stats",
      max: 100,
    },
    {
      id: "drunk",
      type: "number",
      question: "Got drunk 🍷",
      category: "Stats",
      max: 100,
    },
    {
      id: "books",
      type: "number-text-photo",
      question: "Read books 📚",
      category: "Stats",
      max: 100,
      subText: "Tell us more about what you liked/hated/favorites",
    },
    {
      id: "breakdowns",
      type: "number",
      question: "Mental breakdowns count 😭",
      category: "Stats",
      max: 100,
    },
    {
      id: "hotOutfits",
      type: "number-photo",
      question: "Hot outfits count 🔥",
      category: "Stats",
      max: 100,
    },
  ];

  const handleFileUpload = (questionId, files, monthIndex = null) => {
    const fileArray = Array.from(files);
    const readers = fileArray.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      if (monthIndex !== null) {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            months: {
              ...prev[questionId]?.months,
              [monthIndex]: {
                ...prev[questionId]?.months?.[monthIndex],
                photos: [
                  ...(prev[questionId]?.months?.[monthIndex]?.photos || []),
                  ...images,
                ],
              },
            },
          },
        }));
      } else {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: {
            ...prev[questionId],
            photos: [...(prev[questionId]?.photos || []), ...images],
          },
        }));
      }
    });
  };

  const removePhoto = (questionId, photoIndex, monthIndex = null) => {
    if (monthIndex !== null) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          months: {
            ...prev[questionId]?.months,
            [monthIndex]: {
              ...prev[questionId]?.months?.[monthIndex],
              photos: prev[questionId]?.months?.[monthIndex]?.photos.filter(
                (_, i) => i !== photoIndex
              ),
            },
          },
        },
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          photos: prev[questionId]?.photos.filter((_, i) => i !== photoIndex),
        },
      }));
    }
  };

  const updateAnswer = (
    questionId,
    value,
    field = "value",
    monthIndex = null
  ) => {
    if (monthIndex !== null) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          months: {
            ...prev[questionId]?.months,
            [monthIndex]: {
              ...prev[questionId]?.months?.[monthIndex],
              [field]: value,
            },
          },
        },
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          [field]: value,
        },
      }));
    }
  };

  const toggleLifeEvent = (event) => {
    const current = answers.lifeEvents?.selected || [];
    const updated = current.includes(event)
      ? current.filter((e) => e !== event)
      : [...current, event];
    updateAnswer("lifeEvents", updated, "selected");
  };

  const generateSlides = () => {
    const slides = [];

    // Title slide
    slides.push({
      type: "title",
      title: "✨ My Year in Review ✨",
      subtitle: "Buckle up, it's been a RIDE 🎢",
      gradient: "from-pink-400 via-purple-400 to-indigo-400",
    });

    // Romance section
    if (answers.dates?.value || answers.breakups?.value) {
      const dateCount = parseInt(answers.dates?.value || 0);
      const breakupCount = parseInt(answers.breakups?.value || 0);
      const relCount = parseInt(answers.relationships?.value || 0);

      let commentary = "";
      if (dateCount > 30) commentary = "Girl what?? 😳";

      if (relCount > 1 && breakupCount > 1) {
        commentary += commentary
          ? " ...Too hot to handle. 🔥"
          : "...Too hot to handle. 🔥";
      }

      slides.push({
        type: "stat",
        title: "💕 Romance Stats",
        stats: [
          { label: "Dates", value: answers.dates?.value || 0 },
          { label: "Breakups", value: answers.breakups?.value || 0 },
        ],
        commentary: commentary,
        gradient: "from-rose-400 via-pink-400 to-red-400",
      });
    }

    if (answers.relationships?.value) {
      const relCount = parseInt(answers.relationships?.value);
      let subtitle = "";
      if (relCount === 0) subtitle = "Single & Thriving Era 👑";
      else if (relCount === 1) subtitle = "Committed Queen 💍";
      else if (relCount > 3) subtitle = "The Heart Wants What It Wants 💫";
      else subtitle = "Love is a Journey 💕";

      slides.push({
        type: "stat-single",
        title: "💑 Relationships",
        value: answers.relationships?.value,
        subtitle: subtitle,
        gradient: "from-pink-400 via-rose-400 to-purple-400",
      });
    }

    if (answers.funThings?.value) {
      slides.push({
        type: "text-photo",
        title: "🎉 Fun Relationship Moments",
        text: answers.funThings?.value,
        photos: answers.funThings?.photos || [],
        gradient: "from-yellow-400 via-orange-400 to-pink-400",
      });
    }

    if (answers.worstThings?.value) {
      slides.push({
        type: "text-photo",
        title: "😬 Lessons Learned",
        text: answers.worstThings?.value,
        photos: answers.worstThings?.photos || [],
        gradient: "from-purple-400 via-indigo-400 to-blue-400",
      });
    }

    if (answers.datingStory?.value) {
      slides.push({
        type: "text-photo",
        title: "🚩 Craziest Dating Story",
        text: answers.datingStory?.value,
        photos: answers.datingStory?.photos || [],
        gradient: "from-red-500 via-red-400 to-orange-400",
        redFlag: true,
      });
    }

    // Life events
    if (answers.lifeEvents?.selected?.length > 0 || answers.lifeEvents?.other) {
      const allEvents = [
        ...(answers.lifeEvents?.selected || []),
        answers.lifeEvents?.other,
      ].filter(Boolean);

      allEvents.forEach((event) => {
        const hasDetails = answers.lifeEventsDetails?.details?.[event];
        const hasPhotos =
          answers.lifeEventsDetails?.photos?.[event]?.length > 0;

        if (hasDetails || hasPhotos) {
          slides.push({
            type: "text-photo",
            title: `🌟 ${event}`,
            text: hasDetails || "",
            photos: answers.lifeEventsDetails?.photos?.[event] || [],
            gradient: "from-cyan-400 via-blue-400 to-purple-400",
          });
        } else {
          // Just show the event name if no details
          if (
            !slides.find(
              (s) => s.type === "list" && s.title === "🌟 Life Events"
            )
          ) {
            slides.push({
              type: "list",
              title: "🌟 Life Events",
              items: [],
              gradient: "from-cyan-400 via-blue-400 to-purple-400",
            });
          }
          const lifeEventsSlide = slides.find(
            (s) => s.type === "list" && s.title === "🌟 Life Events"
          );
          lifeEventsSlide.items.push(event);
        }
      });
    }

    // Trips
    if (answers.trips?.months) {
      Object.entries(answers.trips.months).forEach(([monthIdx, data]) => {
        if (data.location || data.photos?.length > 0) {
          slides.push({
            type: "text-photo",
            title: `✈️ ${months[monthIdx]} Adventures`,
            text: data.location || "",
            photos: data.photos || [],
            gradient: "from-teal-400 via-cyan-400 to-blue-400",
          });
        }
      });
    }

    // Hobbies
    if (answers.hobbies?.value) {
      slides.push({
        type: "text",
        title: "🎨 New Hobbies",
        text: answers.hobbies?.value,
        gradient: "from-green-400 via-emerald-400 to-teal-400",
      });
    }

    // Year highlight
    if (
      answers.yearHighlight?.value ||
      answers.yearHighlight?.photos?.length > 0
    ) {
      slides.push({
        type: "text-photo",
        title: "⭐ Year Highlight",
        text: answers.yearHighlight?.value || "",
        photos: answers.yearHighlight?.photos || [],
        gradient: "from-amber-400 via-yellow-400 to-orange-400",
      });
    }

    // Stats section
    const stats = [];
    if (answers.partying?.value) {
      const count = parseInt(answers.partying?.value);
      let comment =
        count > 50
          ? "(Party animal! 🦁)"
          : count > 20
          ? "(Social butterfly 🦋)"
          : "(Casual vibes ✨)";
      stats.push({
        label: "Party Nights",
        value: answers.partying.value,
        emoji: "🎊",
        comment,
      });
    }
    if (answers.drunk?.value) {
      const count = parseInt(answers.drunk?.value);
      let comment =
        count > 30
          ? "(No regrets. 🔥)"
          : count > 10
          ? "(Tipsy queen 👑)"
          : "(Responsible icon 🌟)";
      stats.push({
        label: "Got Drunk",
        value: answers.drunk.value,
        emoji: "🍷",
        comment,
      });
    }
    if (answers.books?.value) {
      const count = parseInt(answers.books?.value);
      let comment =
        count > 30
          ? "(Intellectual queen! 👑)"
          : count > 10
          ? "(Bookworm era 📖)"
          : "(At least you tried! 💫)";
      stats.push({
        label: "Books Read",
        value: answers.books.value,
        emoji: "📚",
        comment,
      });
    }
    if (answers.breakdowns?.value) {
      const count = parseInt(answers.breakdowns?.value);
      let comment =
        count > 20
          ? "(But we're stronger now! 💪)"
          : count > 5
          ? "(Growth hurts 🌱)"
          : "(Queen of stability! 👑)";
      stats.push({
        label: "Mental Breakdowns",
        value: answers.breakdowns.value,
        emoji: "😭",
        comment,
      });
    }
    if (answers.hotOutfits?.value) {
      const count = parseInt(answers.hotOutfits?.value);
      let comment =
        count > 50
          ? "(SERVE AFTER SERVE! 🔥)"
          : count > 20
          ? "(Fashion icon! 💅)"
          : "(Quality > Quantity 👗)";
      stats.push({
        label: "Hot Outfits",
        value: answers.hotOutfits.value,
        emoji: "🔥",
        comment,
      });
    }

    if (stats.length > 0) {
      slides.push({
        type: "stats-grid",
        title: "📊 Year by Numbers",
        stats: stats,
        gradient: "from-purple-400 via-pink-400 to-rose-400",
      });
    }

    if (answers.books?.text || answers.books?.photos?.length > 0) {
      slides.push({
        type: "text-photo",
        title: "📖 Book Highlights",
        text: answers.books?.text || "",
        photos: answers.books?.photos || [],
        gradient: "from-indigo-400 via-purple-400 to-pink-400",
      });
    }

    if (answers.hotOutfits?.photos?.length > 0) {
      slides.push({
        type: "photo-grid",
        title: "🔥 Hot Outfit Collection",
        photos: answers.hotOutfits.photos,
        gradient: "from-rose-400 via-red-400 to-pink-400",
      });
    }

    // End slide
    slides.push({
      type: "end",
      title: "Here's to Another Year of Chaos! 🥂",
      subtitle: "Same time next year? 💅✨",
      gradient: "from-purple-400 via-pink-400 to-rose-400",
    });

    return slides;
  };

  const renderQuestion = () => {
    const question = questions[currentStep];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-purple-600">
                {question.category}
              </span>
              <span className="text-sm text-gray-500">
                Question {currentStep + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {question.question}
          </h2>
          {question.suggestion && (
            <p className="text-gray-600 mb-4 italic">{question.suggestion}</p>
          )}

          <div className="space-y-4">
            {question.type === "number" && (
              <input
                type="number"
                min="0"
                max={question.max}
                value={answers[question.id]?.value || ""}
                onChange={(e) => updateAnswer(question.id, e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                placeholder="Enter a number"
              />
            )}

            {(question.type === "text" || question.type === "text-photo") && (
              <textarea
                value={answers[question.id]?.value || ""}
                onChange={(e) => updateAnswer(question.id, e.target.value)}
                maxLength={500}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg resize-none"
                rows="4"
                placeholder="Type your answer..."
              />
            )}

            {question.type === "number-photo" && (
              <>
                <input
                  type="number"
                  min="0"
                  max={question.max}
                  value={answers[question.id]?.value || ""}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                  placeholder="Enter a number"
                />
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                  <Upload className="mr-2" size={20} />
                  <span>Upload Photos</span>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileUpload(question.id, e.target.files)
                    }
                    className="hidden"
                  />
                </label>
                {answers[question.id]?.photos?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {answers[question.id].photos.map((photo, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={photo}
                          alt=""
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(question.id, idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {question.type === "text-photo" && (
              <div>
                <textarea
                  value={answers[question.id]?.value || ""}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  maxLength={500}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg resize-none mb-4"
                  rows="4"
                  placeholder="Type your answer..."
                />
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                  <Upload className="mr-2" size={20} />
                  <span>Upload Photos</span>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileUpload(question.id, e.target.files)
                    }
                    className="hidden"
                  />
                </label>
                {answers[question.id]?.photos?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {answers[question.id].photos.map((photo, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={photo}
                          alt=""
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(question.id, idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {question.type === "number-text-photo" && (
              <>
                <input
                  type="number"
                  min="0"
                  max={question.max}
                  value={answers[question.id]?.value || ""}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                  placeholder="Enter a number"
                />
                <textarea
                  value={answers[question.id]?.text || ""}
                  onChange={(e) =>
                    updateAnswer(question.id, e.target.value, "text")
                  }
                  maxLength={500}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg resize-none"
                  rows="3"
                  placeholder={question.subText}
                />
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                  <Upload className="mr-2" size={20} />
                  <span>Upload Photos</span>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileUpload(question.id, e.target.files)
                    }
                    className="hidden"
                  />
                </label>
                {answers[question.id]?.photos?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {answers[question.id].photos.map((photo, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={photo}
                          alt=""
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(question.id, idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {question.type === "multi-select" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleLifeEvent(option)}
                      className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
                        answers[question.id]?.selected?.includes(option)
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-300 hover:border-purple-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={answers[question.id]?.other || ""}
                  onChange={(e) =>
                    updateAnswer(question.id, e.target.value, "other")
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                  placeholder="Other (type here)"
                />
              </>
            )}

            {question.type === "life-events-details" && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {(() => {
                  const selectedEvents = [
                    ...(answers.lifeEvents?.selected || []),
                    ...(answers.lifeEvents?.other
                      ? [answers.lifeEvents.other]
                      : []),
                  ].filter(Boolean);

                  if (selectedEvents.length === 0) {
                    return (
                      <p className="text-gray-500 text-center py-8">
                        No life events selected. You can skip this question.
                      </p>
                    );
                  }

                  return selectedEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="border-2 border-purple-200 rounded-xl p-4 bg-purple-50/30"
                    >
                      <h3 className="font-semibold text-lg mb-3 text-purple-700">
                        {event}
                      </h3>
                      <textarea
                        value={answers[question.id]?.details?.[event] || ""}
                        onChange={(e) => {
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: {
                              ...prev[question.id],
                              details: {
                                ...prev[question.id]?.details,
                                [event]: e.target.value,
                              },
                            },
                          }));
                        }}
                        maxLength={500}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none mb-2 resize-none"
                        rows="2"
                        placeholder="Tell us more... (e.g., what course? how did it happen?)"
                      />
                      <label className="flex items-center justify-center w-full px-3 py-2 border border-dashed border-purple-400 rounded-lg cursor-pointer hover:border-purple-600 transition-colors text-sm">
                        <Upload className="mr-2" size={16} />
                        <span>Add Photos</span>
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => {
                            const fileArray = Array.from(e.target.files);
                            const readers = fileArray.map((file) => {
                              return new Promise((resolve) => {
                                const reader = new FileReader();
                                reader.onload = (e) => resolve(e.target.result);
                                reader.readAsDataURL(file);
                              });
                            });

                            Promise.all(readers).then((images) => {
                              setAnswers((prev) => ({
                                ...prev,
                                [question.id]: {
                                  ...prev[question.id],
                                  photos: {
                                    ...prev[question.id]?.photos,
                                    [event]: [
                                      ...(prev[question.id]?.photos?.[event] ||
                                        []),
                                      ...images,
                                    ],
                                  },
                                },
                              }));
                            });
                          }}
                          className="hidden"
                        />
                      </label>
                      {answers[question.id]?.photos?.[event]?.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {answers[question.id].photos[event].map(
                            (photo, photoIdx) => (
                              <div key={photoIdx} className="relative group">
                                <img
                                  src={photo}
                                  alt=""
                                  className="w-full h-16 object-cover rounded"
                                />
                                <button
                                  onClick={() => {
                                    setAnswers((prev) => ({
                                      ...prev,
                                      [question.id]: {
                                        ...prev[question.id],
                                        photos: {
                                          ...prev[question.id]?.photos,
                                          [event]: prev[question.id]?.photos?.[
                                            event
                                          ].filter((_, i) => i !== photoIdx),
                                        },
                                      },
                                    }));
                                  }}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            )}

            {question.type === "monthly-trips" && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {months.map((month, idx) => (
                  <div
                    key={idx}
                    className="border-2 border-gray-200 rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-lg mb-2">{month}</h3>
                    <input
                      type="text"
                      value={
                        answers[question.id]?.months?.[idx]?.location || ""
                      }
                      onChange={(e) =>
                        updateAnswer(
                          question.id,
                          e.target.value,
                          "location",
                          idx
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none mb-2"
                      placeholder="Where did you go?"
                    />
                    <label className="flex items-center justify-center w-full px-3 py-2 border border-dashed border-purple-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors text-sm">
                      <Upload className="mr-2" size={16} />
                      <span>Add Photos</span>
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileUpload(question.id, e.target.files, idx)
                        }
                        className="hidden"
                      />
                    </label>
                    {answers[question.id]?.months?.[idx]?.photos?.length >
                      0 && (
                      <div className="grid grid-cols-4 gap-1 mt-2">
                        {answers[question.id].months[idx].photos.map(
                          (photo, photoIdx) => (
                            <div key={photoIdx} className="relative group">
                              <img
                                src={photo}
                                alt=""
                                className="w-full h-16 object-cover rounded"
                              />
                              <button
                                onClick={() =>
                                  removePhoto(question.id, photoIdx, idx)
                                }
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="mr-1" size={20} />
              Back
            </button>

            <button
              onClick={() => {
                if (currentStep < questions.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setShowPresentation(true);
                }
              }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              {currentStep === questions.length - 1 ? (
                <>
                  Generate
                  <Sparkles className="ml-1" size={20} />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-1" size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSlide = (slide) => {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${slide.gradient} flex items-center justify-center p-8 relative overflow-hidden`}
      >
        {slide.redFlag && (
          <div className="absolute inset-0 opacity-10 text-6xl">
            {Array.from({ length: 50 }).map((_, i) => (
              <span
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >
                🚩
              </span>
            ))}
          </div>
        )}

        <div className="relative z-10 max-w-4xl w-full">
          {slide.type === "title" && (
            <div className="text-center">
              <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-3xl text-white/90 drop-shadow">
                {slide.subtitle}
              </p>
            </div>
          )}

          {slide.type === "stat-single" && (
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
                {slide.title}
              </h2>
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-12 inline-block mb-6">
                <div className="text-8xl font-bold text-white">
                  {slide.value}
                </div>
              </div>
              {slide.subtitle && (
                <p className="text-3xl text-white/90 font-semibold drop-shadow">
                  {slide.subtitle}
                </p>
              )}
            </div>
          )}

          {slide.type === "stat" && (
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white mb-12 drop-shadow-lg">
                {slide.title}
              </h2>
              <div className="grid grid-cols-2 gap-8 mb-6">
                {slide.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white/20 backdrop-blur-lg rounded-3xl p-8"
                  >
                    <div className="text-6xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-2xl text-white/90">{stat.label}</div>
                  </div>
                ))}
              </div>
              {slide.commentary && (
                <p className="text-2xl text-white/90 font-semibold drop-shadow">
                  {slide.commentary}
                </p>
              )}
            </div>
          )}

          {slide.type === "text" && (
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-2xl text-white/90 leading-relaxed bg-white/20 backdrop-blur-lg rounded-3xl p-8">
                {slide.text}
              </p>
            </div>
          )}

          {slide.type === "text-photo" && (
            <div>
              <h2 className="text-5xl font-bold text-white mb-8 text-center drop-shadow-lg">
                {slide.title}
              </h2>
              {slide.text && (
                <p className="text-xl text-white/90 mb-6 bg-white/20 backdrop-blur-lg rounded-2xl p-6">
                  {slide.text}
                </p>
              )}
              {slide.photos?.length > 0 && (
                <div
                  className={`grid gap-4 ${
                    slide.photos.length === 1
                      ? "grid-cols-1"
                      : slide.photos.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  }`}
                >
                  {slide.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt=""
                      className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {slide.type === "list" && (
            <div>
              <h2 className="text-5xl font-bold text-white mb-8 text-center drop-shadow-lg">
                {slide.title}
              </h2>
              <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8">
                <ul className="text-2xl text-white/90 space-y-4">
                  {slide.items.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="mr-4">✨</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {slide.photos?.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {slide.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt=""
                      className="w-full h-48 object-cover rounded-2xl shadow-2xl"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {slide.type === "stats-grid" && (
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white mb-12 drop-shadow-lg">
                {slide.title}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {slide.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white/20 backdrop-blur-lg rounded-3xl p-6"
                  >
                    <div className="text-4xl mb-2">{stat.emoji}</div>
                    <div className="text-5xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-lg text-white/90 mb-2">
                      {stat.label}
                    </div>
                    {stat.comment && (
                      <div className="text-sm text-white/80 italic">
                        {stat.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === "photo-grid" && (
            <div>
              <h2 className="text-5xl font-bold text-white mb-8 text-center drop-shadow-lg">
                {slide.title}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {slide.photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt=""
                    className="w-full h-64 object-cover rounded-2xl shadow-2xl"
                  />
                ))}
              </div>
            </div>
          )}

          {slide.type === "end" && (
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-3xl text-white/90 drop-shadow">
                {slide.subtitle}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!showPresentation) {
    return renderQuestion();
  }

  const slides = generateSlides();

  return (
    <div className="relative">
      {renderSlide(slides[currentSlide])}

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-lg rounded-full px-6 py-4">
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="text-white hover:text-pink-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))
          }
          disabled={currentSlide === slides.length - 1}
          className="text-white hover:text-pink-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <button
        onClick={() => {
          setShowPresentation(false);
          setCurrentSlide(0);
        }}
        className="fixed top-8 right-8 bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all"
      >
        Edit Answers
      </button>
    </div>
  );
};

export default App;
