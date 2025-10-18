import { ChevronLeft, ChevronRight, Sparkles, Upload, X } from "lucide-react";
import { useState } from "react";

interface Answer {
  value?: string | number;
  text?: string;
  photos?: string[];
  selected?: string[];
  other?: string;
  months?: { [key: number]: { location?: string; photos?: string[] } };
  details?: { [key: string]: string };
  [key: string]: any;
}

interface Answers {
  [key: string]: Answer;
}

interface Slide {
  type: string;
  title: string;
  subtitle?: string;
  text?: string;
  photos?: string[];
  stats?: Array<{
    label: string;
    value: string | number;
    emoji?: string;
    comment?: string;
  }>;
  items?: string[];
  gradient: string;
  redFlag?: boolean;
  commentary?: string;
  value?: string | number;
}

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showPresentation, setShowPresentation] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [webhookUrl] = useState(
    "https://kk-agent.app.n8n.cloud/webhook-test/d0b06c35-1717-451a-86e0-b0cf54b1ed6d"
  );
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState("");
  const [llmResponse, setLlmResponse] = useState<string | null>(null);

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

  const handleFileUpload = (
    questionId: string,
    files: FileList | null,
    monthIndex: number | null = null
  ) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const readers = fileArray.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          }
        };
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

  const removePhoto = (
    questionId: string,
    photoIndex: number,
    monthIndex: number | null = null
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
    questionId: string,
    value: string | number,
    field: string = "value",
    monthIndex: number | null = null
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

  const toggleLifeEvent = (event: string) => {
    const current = answers.lifeEvents?.selected || [];
    const updated = current.includes(event)
      ? current.filter((e) => e !== event)
      : [...current, event];
    updateAnswer("lifeEvents", updated as any, "selected");
  };

  const sendToWebhook = async () => {
    if (!webhookUrl) {
      setWebhookStatus("Please enter a webhook URL");
      return;
    }

    setWebhookStatus("Sending to n8n...");

    try {
      const payload = {
        timestamp: new Date().toISOString(),
        answers: answers,
        summary: {
          totalQuestions: questions.length,
          answeredQuestions: Object.keys(answers).length,
          dates: answers.dates?.value || 0,
          breakups: answers.breakups?.value || 0,
          relationships: answers.relationships?.value || 0,
          lifeEvents: [
            ...(answers.lifeEvents?.selected || []),
            answers.lifeEvents?.other,
          ].filter(Boolean),
          totalPhotos: Object.values(answers).reduce((acc, val) => {
            if (val?.photos) return acc + val.photos.length;
            if (val?.months) {
              return (
                acc +
                Object.values(val.months).reduce(
                  (sum, month) => sum + (month?.photos?.length || 0),
                  0
                )
              );
            }
            return acc;
          }, 0),
        },
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setWebhookStatus("✅ Successfully sent to n8n!");

        if (data.llmResponse) {
          setLlmResponse(data.llmResponse);
        }

        setTimeout(() => {
          setShowWebhookModal(false);
          setWebhookStatus("");
        }, 2000);
      } else {
        setWebhookStatus(`❌ Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setWebhookStatus(`❌ Failed to send: ${(error as Error).message}`);
    }
  };

  const generateSlides = (): Slide[] => {
    const slides: Slide[] = [];

    slides.push({
      type: "title",
      title: "✨ My Year in Review ✨",
      subtitle: "Buckle up, it's been a RIDE 🎢",
      gradient: "from-pink-400 via-purple-400 to-indigo-400",
    });

    if (answers.dates?.value || answers.breakups?.value) {
      const dateCount = parseInt(String(answers.dates?.value || 0));
      const breakupCount = parseInt(String(answers.breakups?.value || 0));
      const relCount = parseInt(String(answers.relationships?.value || 0));

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
          { label: "Dates", value: String(answers.dates?.value || 0) },
          { label: "Breakups", value: String(answers.breakups?.value || 0) },
        ],
        commentary: commentary,
        gradient: "from-rose-400 via-pink-400 to-red-400",
      });
    }

    if (answers.relationships?.value) {
      const relCount = parseInt(String(answers.relationships?.value || 0));
      let subtitle = "";
      if (relCount === 0) subtitle = "Single & Thriving Era 👑";
      else if (relCount === 1) subtitle = "Committed Queen 💍";
      else if (relCount > 3) subtitle = "The Heart Wants What It Wants 💫";
      else subtitle = "Love is a Journey 💕";

      slides.push({
        type: "stat-single",
        title: "💑 Relationships",
        value: String(answers.relationships?.value || 0),
        subtitle: subtitle,
        gradient: "from-pink-400 via-rose-400 to-purple-400",
      });
    }

    if (answers.funThings?.value) {
      slides.push({
        type: "text-photo",
        title: "🎉 Fun Relationship Moments",
        text: String(answers.funThings?.value || ""),
        photos: answers.funThings?.photos || [],
        gradient: "from-yellow-400 via-orange-400 to-pink-400",
      });
    }

    if (answers.worstThings?.value) {
      slides.push({
        type: "text-photo",
        title: "😬 Lessons Learned",
        text: String(answers.worstThings?.value || ""),
        photos: answers.worstThings?.photos || [],
        gradient: "from-purple-400 via-indigo-400 to-blue-400",
      });
    }

    if (answers.datingStory?.value) {
      slides.push({
        type: "text-photo",
        title: "🚩 Craziest Dating Story",
        text: String(answers.datingStory?.value || ""),
        photos: answers.datingStory?.photos || [],
        gradient: "from-red-500 via-red-400 to-orange-400",
        redFlag: true,
      });
    }

    if (
      (answers.lifeEvents?.selected?.length || 0) > 0 ||
      answers.lifeEvents?.other
    ) {
      const allEvents = [
        ...(answers.lifeEvents?.selected || []),
        answers.lifeEvents?.other,
      ].filter(Boolean);

      allEvents.forEach((event: string | undefined) => {
        if (!event) return;
        const hasDetails =
          answers.lifeEventsDetails?.details?.[event as string];
        const hasPhotos =
          (answers.lifeEventsDetails?.photos?.[event as string]?.length || 0) >
          0;

        if (hasDetails || hasPhotos) {
          slides.push({
            type: "text-photo",
            title: `🌟 ${event}`,
            text: String(hasDetails || ""),
            photos: answers.lifeEventsDetails?.photos?.[event as string] || [],
            gradient: "from-cyan-400 via-blue-400 to-purple-400",
          });
        } else {
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
          if (lifeEventsSlide?.items) {
            lifeEventsSlide.items.push(event);
          }
        }
      });
    }

    if (answers.trips?.months) {
      Object.entries(answers.trips.months).forEach(([monthIdx, data]) => {
        if (data.location || (data.photos?.length || 0) > 0) {
          slides.push({
            type: "text-photo",
            title: `✈️ ${months[parseInt(monthIdx)]} Adventures`,
            text: data.location || "",
            photos: data.photos || [],
            gradient: "from-teal-400 via-cyan-400 to-blue-400",
          });
        }
      });
    }

    if (answers.hobbies?.value) {
      slides.push({
        type: "text",
        title: "🎨 New Hobbies",
        text: String(answers.hobbies?.value || ""),
        gradient: "from-green-400 via-emerald-400 to-teal-400",
      });
    }

    if (
      answers.yearHighlight?.value ||
      (answers.yearHighlight?.photos?.length || 0) > 0
    ) {
      slides.push({
        type: "text-photo",
        title: "⭐ Year Highlight",
        text: String(answers.yearHighlight?.value || ""),
        photos: answers.yearHighlight?.photos || [],
        gradient: "from-amber-400 via-yellow-400 to-orange-400",
      });
    }

    const stats = [];
    if (answers.partying?.value) {
      const count = parseInt(String(answers.partying?.value || 0));
      let comment =
        count > 50
          ? "(Party animal! 🦁)"
          : count > 20
          ? "(Social butterfly 🦋)"
          : "(Casual vibes ✨)";
      stats.push({
        label: "Party Nights",
        value: String(answers.partying.value),
        emoji: "🎊",
        comment,
      });
    }
    if (answers.drunk?.value) {
      const count = parseInt(String(answers.drunk?.value || 0));
      let comment =
        count > 30
          ? "(No regrets. 🔥)"
          : count > 10
          ? "(Tipsy queen 👑)"
          : "(Responsible icon 🌟)";
      stats.push({
        label: "Got Drunk",
        value: String(answers.drunk.value),
        emoji: "🍷",
        comment,
      });
    }
    if (answers.books?.value) {
      const count = parseInt(String(answers.books?.value || 0));
      let comment =
        count > 30
          ? "(Intellectual queen! 👑)"
          : count > 10
          ? "(Bookworm era 📖)"
          : "(At least you tried! 💫)";
      stats.push({
        label: "Books Read",
        value: String(answers.books.value),
        emoji: "📚",
        comment,
      });
    }
    if (answers.breakdowns?.value) {
      const count = parseInt(String(answers.breakdowns?.value || 0));
      let comment =
        count > 20
          ? "(But we're stronger now! 💪)"
          : count > 5
          ? "(Growth hurts 🌱)"
          : "(Queen of stability! 👑)";
      stats.push({
        label: "Mental Breakdowns",
        value: String(answers.breakdowns.value),
        emoji: "😭",
        comment,
      });
    }
    if (answers.hotOutfits?.value) {
      const count = parseInt(String(answers.hotOutfits?.value || 0));
      let comment =
        count > 50
          ? "(SERVE AFTER SERVE! 🔥)"
          : count > 20
          ? "(Fashion icon! 💅)"
          : "(Quality > Quantity 👗)";
      stats.push({
        label: "Hot Outfits",
        value: String(answers.hotOutfits.value),
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

    if (answers.books?.text || (answers.books?.photos?.length || 0) > 0) {
      slides.push({
        type: "text-photo",
        title: "📖 Book Highlights",
        text: String(answers.books?.text || ""),
        photos: answers.books?.photos || [],
        gradient: "from-indigo-400 via-purple-400 to-pink-400",
      });
    }

    if ((answers.hotOutfits?.photos?.length || 0) > 0) {
      slides.push({
        type: "photo-grid",
        title: "🔥 Hot Outfit Collection",
        photos: answers.hotOutfits.photos,
        gradient: "from-rose-400 via-red-400 to-pink-400",
      });
    }

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
                value={String(answers[question.id]?.value || "")}
                onChange={(e) => updateAnswer(question.id, e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                placeholder="Enter a number"
              />
            )}

            {(question.type === "text" || question.type === "text-photo") && (
              <textarea
                value={String(answers[question.id]?.value || "")}
                onChange={(e) => updateAnswer(question.id, e.target.value)}
                maxLength={500}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg resize-none"
                rows={4}
                placeholder="Type your answer..."
              />
            )}

            {question.type === "number-photo" && (
              <>
                <input
                  type="number"
                  min="0"
                  max={question.max}
                  value={String(answers[question.id]?.value || "")}
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
                {(answers[question.id]?.photos?.length || 0) > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {answers[question.id].photos?.map(
                      (photo: string, idx: number) => (
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
                      )
                    )}
                  </div>
                )}
              </>
            )}

            {question.type === "text-photo" && (
              <div>
                <textarea
                  value={String(answers[question.id]?.value || "")}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  maxLength={500}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg resize-none mb-4"
                  rows={4}
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
                {(answers[question.id]?.photos?.length || 0) > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {answers[question.id].photos?.map(
                      (photo: string, idx: number) => (
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
                      )
                    )}
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
                  value={String(answers[question.id]?.value || "")}
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
                  rows={3}
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
                {(answers[question.id]?.photos?.length || 0) > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {answers[question.id].photos?.map(
                      (photo: string, idx: number) => (
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
                      )
                    )}
                  </div>
                )}
              </>
            )}

            {question.type === "multi-select" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {question.options?.map((option) => (
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
                        rows={2}
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
                            if (!e.target.files) return;
                            const fileArray = Array.from(e.target.files);
                            const readers = fileArray.map((file) => {
                              return new Promise<string>((resolve) => {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    resolve(event.target.result as string);
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            });

                            Promise.all(readers).then((images) => {
                              setAnswers(
                                (prev) =>
                                  ({
                                    ...prev,
                                    [question.id]: {
                                      ...prev[question.id],
                                      photos: {
                                        ...prev[question.id]?.photos,
                                        [event as string]: [
                                          ...(prev[question.id]?.photos?.[
                                            event as string
                                          ] || []),
                                          ...images,
                                        ],
                                      },
                                    },
                                  } as Answers)
                              );
                            });
                          }}
                          className="hidden"
                        />
                      </label>
                      {(answers[question.id]?.photos?.[event]?.length || 0) >
                        0 && (
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {answers[question.id].photos?.[event]?.map(
                            (photo: string, photoIdx: number) => (
                              <div key={photoIdx} className="relative group">
                                <img
                                  src={photo}
                                  alt=""
                                  className="w-full h-20 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => {
                                    setAnswers(
                                      (prev) =>
                                        ({
                                          ...prev,
                                          [question.id]: {
                                            ...prev[question.id],
                                            photos: {
                                              ...prev[question.id]?.photos,
                                              [event as string]: prev[
                                                question.id
                                              ]?.photos?.[
                                                event as string
                                              ]?.filter(
                                                (_: any, i: number) =>
                                                  i !== photoIdx
                                              ),
                                            },
                                          },
                                        } as Answers)
                                    );
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
              <div className="space-y-4">
                {months.map((month, monthIdx) => (
                  <div
                    key={monthIdx}
                    className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50/30"
                  >
                    <h3 className="font-semibold text-lg mb-3 text-blue-700">
                      {month}
                    </h3>
                    <input
                      type="text"
                      value={
                        answers[question.id]?.months?.[monthIdx]?.location || ""
                      }
                      onChange={(e) =>
                        updateAnswer(
                          question.id,
                          e.target.value,
                          "location",
                          monthIdx
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-2"
                      placeholder="Where did you go?"
                    />
                    <label className="flex items-center justify-center w-full px-3 py-2 border border-dashed border-blue-400 rounded-lg cursor-pointer hover:border-blue-600 transition-colors text-sm">
                      <Upload className="mr-2" size={16} />
                      <span>Add Photos</span>
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileUpload(
                            question.id,
                            e.target.files,
                            monthIdx
                          )
                        }
                        className="hidden"
                      />
                    </label>
                    {(answers[question.id]?.months?.[monthIdx]?.photos
                      ?.length || 0) > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {answers[question.id].months?.[monthIdx]?.photos?.map(
                          (photo: string, photoIdx: number) => (
                            <div key={photoIdx} className="relative group">
                              <img
                                src={photo}
                                alt=""
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button
                                onClick={() =>
                                  removePhoto(question.id, photoIdx, monthIdx)
                                }
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
              className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="mr-2" size={20} />
              Previous
            </button>

            <button
              onClick={() => {
                if (currentStep === questions.length - 1) {
                  setShowPresentation(true);
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              {currentStep === questions.length - 1
                ? "Generate Review"
                : "Next"}
              <ChevronRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSlide = (slide: Slide) => {
    const baseClasses =
      "min-h-screen flex items-center justify-center p-8 bg-gradient-to-br";

    switch (slide.type) {
      case "title":
        return (
          <div className={`${baseClasses} ${slide.gradient}`}>
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold mb-4">{slide.title}</h1>
              <p className="text-2xl opacity-90">{slide.subtitle}</p>
            </div>
          </div>
        );

      case "stat":
        return (
          <div className={`${baseClasses} ${slide.gradient}`}>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-center text-white">
              <h2 className="text-4xl font-bold mb-6">{slide.title}</h2>
              <div className="grid grid-cols-2 gap-8 mb-6">
                {slide.stats?.map((stat: any, idx: number) => (
                  <div key={idx} className="bg-white/20 rounded-2xl p-6">
                    <div className="text-5xl font-bold mb-2">{stat.value}</div>
                    <div className="text-xl">{stat.label}</div>
                  </div>
                ))}
              </div>
              {slide.commentary && (
                <p className="text-2xl font-semibold">{slide.commentary}</p>
              )}
            </div>
          </div>
        );

      case "stat-single":
        return (
          <div className={`${baseClasses} ${slide.gradient}`}>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-center text-white">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <div className="text-8xl font-bold mb-4">{slide.value}</div>
              <p className="text-2xl">{slide.subtitle}</p>
            </div>
          </div>
        );

      case "text-photo":
        return (
          <div className={`${baseClasses} ${slide.gradient}`}>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-white max-w-4xl">
              <h2 className="text-4xl font-bold mb-6 text-center">
                {slide.title}
              </h2>
              {slide.text && (
                <p className="text-xl mb-6 text-center leading-relaxed">
                  {slide.text}
                </p>
              )}
              {(slide.photos?.length || 0) > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {slide.photos?.map((photo: string, idx: number) => (
                    <img
                      key={idx}
                      src={photo}
                      alt=""
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "text":
        return (
          <div className={`${baseClasses} ${slide.gradient}`}>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-white max-w-4xl text-center">
              <h2 className="text-4xl font-bold mb-6">{slide.title}</h2>
              <p className="text-xl leading-relaxed">{slide.text}</p>
            </div>
          </div>
        );

      case "list":
        return (
          <div className={`${baseClasses} ${slide.gradient}`}>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-white max-w-4xl">
              <h2 className="text-4xl font-bold mb-6 text-center">
                {slide.title}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {slide.items?.map((item: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white/20 rounded-2xl p-4 text-center"
                  >
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "stats-grid":
        return (
          <div className={`${baseClasses} ${slide.gradient}`}>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-white max-w-6xl">
              <h2 className="text-4xl font-bold mb-8 text-center">
                {slide.title}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {slide.stats?.map((stat: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white/20 rounded-2xl p-6 text-center"
                  >
                    <div className="text-4xl mb-2">{stat.emoji}</div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-lg mb-2">{stat.label}</div>
                    <div className="text-sm opacity-80">{stat.comment}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "photo-grid":
        return (
          <div className={`${baseClasses} ${slide.gradient}`}>
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-white max-w-6xl">
              <h2 className="text-4xl font-bold mb-8 text-center">
                {slide.title}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {slide.photos?.map((photo: string, idx: number) => (
                  <img
                    key={idx}
                    src={photo}
                    alt=""
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case "end":
        return (
          <div className={`${baseClasses} ${slide.gradient}`}>
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold mb-4">{slide.title}</h1>
              <p className="text-2xl opacity-90">{slide.subtitle}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showPresentation) {
    const slides = generateSlides();

    return (
      <div className="min-h-screen bg-black">
        <div className="absolute top-4 right-4 z-10 flex space-x-4">
          <button
            onClick={() => setShowPresentation(false)}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            Back to Questions
          </button>
          <button
            onClick={() => setShowWebhookModal(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Sparkles className="inline mr-2" size={16} />
            Send to AI
          </button>
        </div>

        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <span className="text-white text-lg">
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={() =>
              setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))
            }
            disabled={currentSlide === slides.length - 1}
            className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {renderSlide(slides[currentSlide])}
      </div>
    );
  }

  return renderQuestion();
};

export default App;
