import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface Review {
  id: number
  name: string
  rating: number
  text: string
}

export function AnimatedReviewForm() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [name, setName] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newReview: Review = {
      id: Date.now(),
      name,
      rating,
      text: reviewText,
    }
    setReviews([...reviews, newReview])
    setName("")
    setRating(0)
    setReviewText("")
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Submit a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                className="border-non rounded-xl"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                      star <= (hoverRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="review">Review</Label>
              <Textarea
                className="border-non rounded-xl"
                id="review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </div>
            <Button className=" bg-rose-500 text-white border-non rounded-xl px-2 py-2 hover:bg-rose-700 hover:text-white focus:ring-2 focus:ring-rose-700 focus:ring-opacity-50" type="submit">
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">No reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{review.name}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.text}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
};
export default AnimatedReviewForm;