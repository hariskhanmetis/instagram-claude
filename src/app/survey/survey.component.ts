// survey/survey.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Question {
  id: number;
  text: string;
  type: 'multiple-choice' | 'scale' | 'text';
  options?: string[];
  minLabel?: string;
  maxLabel?: string;
  required: boolean;
}

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  surveyForm: FormGroup;
  userInfoForm: FormGroup;
  currentQuestion: number = -1; // Start at -1 to show user info form first
  responses: any[] = [];
  showUserInfoForm: boolean = true;
  
  questions: Question[] = [
    {
      id: 1,
      text: 'How often do you use Instagram?',
      type: 'multiple-choice',
      options: [
        'Multiple times per day',
        'Once a day',
        'A few times per week',
        'Once a week',
        'Less than once a week'
      ],
      required: true
    },
    {
      id: 2,
      text: 'What is your primary reason for using Instagram?',
      type: 'multiple-choice',
      options: [
        'Keeping up with friends and family',
        'Following celebrities and influencers',
        'Discovering new content',
        'Sharing my own photos/videos',
        'Professional networking',
        'Shopping'
      ],
      required: true
    },
    {
      id: 3,
      text: 'On a scale of 1-5, how satisfied are you with your Instagram experience?',
      type: 'scale',
      minLabel: 'Not satisfied',
      maxLabel: 'Very satisfied',
      required: true
    },
    {
      id: 4,
      text: 'Which Instagram feature do you use most frequently?',
      type: 'multiple-choice',
      options: [
        'Feed posts',
        'Stories',
        'Reels',
        'IGTV',
        'Direct messages',
        'Explore page'
      ],
      required: true
    },
    {
      id: 5,
      text: 'How has Instagram influenced your purchasing decisions?',
      type: 'multiple-choice',
      options: [
        'I frequently buy products I discover on Instagram',
        'I occasionally buy products I discover on Instagram',
        'I rarely buy products I discover on Instagram',
        'I never buy products I discover on Instagram'
      ],
      required: true
    },
    {
      id: 6,
      text: 'Please share any suggestions you have for improving Instagram:',
      type: 'text',
      required: false
    }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize user info form
    this.userInfoForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(13), Validators.max(100)]]
    });
    
    // Initialize survey form
    this.surveyForm = this.fb.group({
      response: ['', this.currentQuestion >= 0 && this.questions[this.currentQuestion]?.required ? Validators.required : []]
    });
  }

  ngOnInit(): void {}

  getProgressWidth(): string {
    if (this.currentQuestion < 0) return '0%';
    return `${((this.currentQuestion + 1) / this.questions.length) * 100}%`;
  }
  
  startSurvey(): void {
    if (this.userInfoForm.valid) {
      // Save user info
      const userInfo = {
        name: this.userInfoForm.get('name')?.value,
        age: this.userInfoForm.get('age')?.value
      };
      
      // Store user info
      this.responses.push({
        type: 'userInfo',
        data: userInfo
      });
      
      // Move to first question
      this.showUserInfoForm = false;
      this.currentQuestion = 0;
      
      // Initialize the form for the first question
      this.surveyForm = this.fb.group({
        response: ['', this.questions[this.currentQuestion].required ? Validators.required : []]
      });
    }
  }

  nextQuestion(): void {
    // Save current response
    if (this.currentQuestion >= 0) {
      this.responses.push({
        questionId: this.questions[this.currentQuestion].id,
        answer: this.surveyForm.get('response')?.value
      });
    }

    // Move to next question or complete survey
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      
      // Reset form with appropriate validation for the new question
      this.surveyForm = this.fb.group({
        response: ['', this.questions[this.currentQuestion].required ? Validators.required : []]
      });
    } else {
      // Survey complete
      this.currentQuestion = this.questions.length;
      this.submitSurvey();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      
      // Reset form with the previous response
      const previousResponse = this.responses.pop();
      this.surveyForm = this.fb.group({
        response: [previousResponse.answer, this.questions[this.currentQuestion].required ? Validators.required : []]
      });
    } else if (this.currentQuestion === 0) {
      // Go back to user info form
      this.showUserInfoForm = true;
      this.currentQuestion = -1;
      // Remove the last user info entry
      this.responses.pop();
    }
  }

  submitSurvey(): void {
    // Here you would typically send the responses to your backend
    console.log('Survey responses:', this.responses);
  }

  onSubmit(): void {
    // This is just a placeholder, the actual submission happens in nextQuestion()
  }

  goHome(): void {
    this.router.navigate(['/welcome']);
  }
}