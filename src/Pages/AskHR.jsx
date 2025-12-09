import { useState } from "react";
import { Upload, Clock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import Navbar from "@/Components/Navbar";
import SideNav from "@/Components/SideNav";

const AskHR = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([
    {
      id: "1",
      title: "Annual Leave Policy Clarification",
      description: "I need clarification about the annual leave policy and how it applies to remote workers.",
      date: "Mar 10, 2024",
      status: "Resolved",
    },
    {
      id: "2",
      title: "Remote Work Equipment Request",
      description: "Requesting additional equipment for my home office setup.",
      date: "Mar 15, 2024",
      status: "Pending",
    },
    {
      id: "3",
      title: "Training Program Schedule",
      description: "When will the next training program start?",
      date: "Mar 8, 2024",
      status: "Resolved",
    },
  ]);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newQuestion = {
      id: (questions.length + 1).toString(),
      title,
      description,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Pending",
    };

    setQuestions([newQuestion, ...questions]);
    setTitle("");
    setDescription("");
    setFile(null);
    toast({
      title: "Success",
      description: "Your question has been submitted successfully",
    });
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
  {/* Sidebar */}
  <div className="w-60 hidden md:block">
    <SideNav />
  </div>

  {/* Main Content */}
  <div className="flex-1 md:ml-3">
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Question Form */}
        <div className="bg-white rounded-nonelg shadow-sm p-6">
          <div className="flex items-center gap-1 mb-6">
            <div className="w-8 h-8 rounded-nonefull bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xl">?</span>
            </div>
            <h1 className="text-xl font-semibold">Ask HR</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Title
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your question title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide more details about your question..."
                className="h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-nonemd p-8">
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <div className="text-center">
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
                        Click to upload
                      </span>
                      <Input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>
                    <span className="text-gray-500"> or drag and drop</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, images, or documents up to 10MB
                  </p>
                  {file && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected file: {file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-nonemd hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Submit Question
            </Button>
          </form>
        </div>

        {/* Question History */}
        <div className="bg-white rounded-nonelg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Question History</h2>
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="p-4 border border-gray-100 rounded-nonelg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {question.status === "Resolved" ? (
                      <Check className="w-5 h-5 text-green-500 mt-1" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500 mt-1" />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {question.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {question.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {question.date}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-nonefull ${
                            question.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {question.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

                </div>
        
  );
};

export default AskHR;
