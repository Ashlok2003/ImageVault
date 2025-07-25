import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  ArrowRight,
  Check,
  ImageIcon,
  Sparkles
} from "lucide-react"
import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div className="mx-24 flex flex-col items-center justify-between">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ImageIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ImageVault</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/signup">
              Sign In
            </Link>
            <Link to="/login" size="sm" className={buttonVariants({
              className: "font-bold"
            })}>Get Started</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="container relative">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 inline-flex items-center justify-center">
                <Sparkles className="mr-1 h-3 w-3" />
                New: AI-powered image optimization
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Upload, Store & Share
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Images Effortlessly
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                The fastest and most secure way to upload, organize, and share your images. Built for creators, teams, and businesses who value simplicity and reliability.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" className="h-12 px-8">
                  Start Uploading Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 bg-transparent">
                  Watch Demo
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-x-8 text-sm text-gray-500">
                <div className="flex items-center gap-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Free 5GB storage
                </div>
                <div className="flex items-center gap-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Cancel anytime
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="mt-16 relative mx-auto max-w-4xl">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl" />
              <div className="relative rounded-xl border bg-white/80 backdrop-blur-sm p-8 shadow-2xl">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-pink-100 to-pink-200" />
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 to-blue-200" />
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-green-100 to-green-200" />
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-100 to-purple-200" />
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-orange-100 to-orange-200" />
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-teal-100 to-teal-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust section */}
        <section className="bg-white">
          <div className="container">
            <p className="text-center font-extrabold text-gray-700 text-2xl py-12">
              Trusted by developers, creators, and teams around the world for seamless file management and blazing-fast performance.
            </p>
          </div>
        </section>

        {/* Stats section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10M+</div>
                <div className="text-sm text-gray-600">Images Uploaded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
