
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Subject {
  id: string;
  name: string;
  grades: number[];
  color: string;
}

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newGrade, setNewGrade] = useState<{ [key: string]: string }>({});

  // Load subjects from localStorage on component mount
  useEffect(() => {
    const savedSubjects = localStorage.getItem("studyplanner-subjects");
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    } else {
      // Initialize with some sample data
      const initialSubjects: Subject[] = [
        {
          id: "1",
          name: "Mathematics",
          grades: [85, 92, 78, 88],
          color: "from-blue-500 to-blue-600"
        },
        {
          id: "2",
          name: "Science",
          grades: [90, 87, 95],
          color: "from-green-500 to-green-600"
        },
        {
          id: "3",
          name: "History",
          grades: [82, 79, 85, 91],
          color: "from-purple-500 to-purple-600"
        }
      ];
      setSubjects(initialSubjects);
      localStorage.setItem("studyplanner-subjects", JSON.stringify(initialSubjects));
    }
  }, []);

  // Save subjects to localStorage whenever subjects change
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem("studyplanner-subjects", JSON.stringify(subjects));
    }
  }, [subjects]);

  const colors = [
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-purple-500 to-purple-600",
    "from-red-500 to-red-600",
    "from-yellow-500 to-yellow-600",
    "from-indigo-500 to-indigo-600",
    "from-pink-500 to-pink-600",
    "from-teal-500 to-teal-600"
  ];

  const addSubject = () => {
    if (!newSubjectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject name",
        variant: "destructive"
      });
      return;
    }

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: newSubjectName,
      grades: [],
      color: colors[subjects.length % colors.length]
    };

    setSubjects([...subjects, newSubject]);
    setNewSubjectName("");
    toast({
      title: "Success",
      description: `${newSubjectName} has been added!`
    });
  };

  const addGrade = (subjectId: string) => {
    const grade = parseFloat(newGrade[subjectId]);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      toast({
        title: "Error",
        description: "Please enter a valid grade (0-100)",
        variant: "destructive"
      });
      return;
    }

    setSubjects(subjects.map(subject => 
      subject.id === subjectId 
        ? { ...subject, grades: [...subject.grades, grade] }
        : subject
    ));

    setNewGrade({ ...newGrade, [subjectId]: "" });
    toast({
      title: "Grade Added",
      description: `Grade ${grade} added successfully!`
    });
  };

  const removeSubject = (subjectId: string) => {
    setSubjects(subjects.filter(subject => subject.id !== subjectId));
    toast({
      title: "Subject Removed",
      description: "Subject has been deleted"
    });
  };

  const calculateAverage = (grades: number[]) => {
    if (grades.length === 0) return 0;
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
  };

  const getGradeStatus = (average: number) => {
    if (average >= 90) return { text: "Excellent", color: "bg-green-100 text-green-800", icon: TrendingUp };
    if (average >= 80) return { text: "Good", color: "bg-blue-100 text-blue-800", icon: TrendingUp };
    if (average >= 70) return { text: "Average", color: "bg-yellow-100 text-yellow-800", icon: Minus };
    return { text: "Needs Improvement", color: "bg-red-100 text-red-800", icon: TrendingDown };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-indigo-900">Academic Subjects</h1>
        <p className="text-gray-600">Track your subjects and monitor your academic progress</p>
      </div>

      {/* Add New Subject */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Subject
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Subject name (e.g., Mathematics)"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSubject()}
              className="flex-1"
            />
            <Button onClick={addSubject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const average = calculateAverage(subject.grades);
          const status = getGradeStatus(average);
          const StatusIcon = status.icon;

          return (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${subject.color} flex items-center justify-center`}>
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeSubject(subject.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Average Grade */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">
                    {average > 0 ? average.toFixed(1) : "No grades yet"}
                  </div>
                  <div className="text-sm text-gray-600">Average Grade</div>
                  {average > 0 && (
                    <Badge className={`mt-2 ${status.color}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.text}
                    </Badge>
                  )}
                </div>

                {/* Grades List */}
                {subject.grades.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Recent Grades:</div>
                    <div className="flex flex-wrap gap-2">
                      {subject.grades.slice(-5).map((grade, index) => (
                        <Badge key={index} variant="secondary">
                          {grade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Grade */}
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Grade (0-100)"
                    value={newGrade[subject.id] || ""}
                    onChange={(e) => setNewGrade({ ...newGrade, [subject.id]: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && addGrade(subject.id)}
                    min="0"
                    max="100"
                    className="flex-1"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => addGrade(subject.id)}
                    disabled={!newGrade[subject.id]}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {subjects.length === 0 && (
        <Card className="text-center p-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects yet</h3>
          <p className="text-gray-600">Add your first subject to start tracking your academic progress!</p>
        </Card>
      )}
    </div>
  );
};

export default Subjects;
