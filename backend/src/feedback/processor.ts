export class FeedbackProcessor {
  static process(feedback: any) {
    // Przykładowa analiza: generuj sugestie na podstawie score i komentarzy
    if (feedback.score < 70) {
      return "Code quality is low. Suggest refactoring and more tests.";
    }
    if (feedback.comments && feedback.comments.includes("security")) {
      return "Review security best practices.";
    }
    return "Code quality is acceptable.";
  }
}
