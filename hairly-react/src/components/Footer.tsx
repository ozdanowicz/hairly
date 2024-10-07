import { Scissors, Instagram, Facebook, Twitter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function FooterComponent() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scissors className="w-6 h-6 text-rose-500" />
              <span className="text-2xl font-bold">Hairly</span>
            </div>
            <p className="text-sm">Connecting you with the best hair professionals in your area.</p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="rounded-full">
                <Instagram className="w-4 h-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Facebook className="w-4 h-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="w-4 h-4" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-rose-500 transition-colors">Find a Salon</a></li>
              <li><a href="#" className="hover:text-rose-500 transition-colors">For Businesses</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-rose-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-rose-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-rose-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-rose-500 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm mb-4">Subscribe to our newsletter for the latest news and offers.</p>
            <form className="space-y-2">
              <Input type="email" placeholder="Your email address" className="bg-white" />
              <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm">&copy; 2023 Hairly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
export default FooterComponent;