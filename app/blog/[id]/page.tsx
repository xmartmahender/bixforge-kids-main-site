'use client';

import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Link from 'next/link';
import UserTracker from '../../components/UserTracker';
import { useParams } from 'next/navigation';

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id;

  // Sample blog post data (in a real app, this would be fetched based on the ID)
  const blogPost = {
    id: postId,
    title: "10 Fun Ways to Encourage Reading in Young Children",
    content: `
      <p>Reading is one of the most important skills a child can develop, and making it fun is key to fostering a lifelong love of books. Here are ten creative ways to encourage reading in young children:</p>

      <h2>1. Create a Cozy Reading Nook</h2>
      <p>Set up a special space dedicated to reading. Use soft pillows, blankets, and good lighting to make it inviting. This gives children a sense that reading is special and important.</p>

      <h2>2. Read Together Daily</h2>
      <p>Make reading a daily routine. Whether it's bedtime stories or afternoon reading sessions, consistency helps children develop the habit of reading.</p>

      <h2>3. Let Children Choose Their Books</h2>
      <p>Give children the freedom to select books that interest them. This autonomy helps them feel more invested in the reading experience.</p>

      <h2>4. Use Different Voices for Characters</h2>
      <p>When reading aloud, use different voices and expressions for different characters. This makes the story come alive and keeps children engaged.</p>

      <h2>5. Connect Books to Real Life</h2>
      <p>Help children make connections between what they read and their own experiences. This makes stories more meaningful and memorable.</p>

      <h2>6. Visit Libraries and Bookstores</h2>
      <p>Regular trips to libraries and bookstores expose children to new books and create positive associations with reading environments.</p>

      <h2>7. Use Technology Wisely</h2>
      <p>Interactive e-books and reading apps can complement traditional books, especially for reluctant readers. Just ensure screen time is balanced.</p>

      <h2>8. Start a Family Book Club</h2>
      <p>Read the same book as a family and discuss it together. This creates shared experiences and helps develop critical thinking skills.</p>

      <h2>9. Reward Reading Achievements</h2>
      <p>Celebrate reading milestones with small rewards or special activities. This positive reinforcement encourages continued reading.</p>

      <h2>10. Be a Reading Role Model</h2>
      <p>Children learn by example. When they see adults reading and enjoying books, they're more likely to develop the same habit.</p>

      <h2>Conclusion</h2>
      <p>Remember, every child is different, and what works for one may not work for another. The key is to be patient, consistent, and to make reading a positive, enjoyable experience. With these strategies, you can help nurture a love of reading that will benefit your child throughout their life.</p>
    `,
    category: "parenting",
    author: "Dr. Sarah Johnson",
    authorBio: "Dr. Sarah Johnson is a child development specialist with over 15 years of experience in early childhood education.",
    date: "2024-12-15",
    readTime: "5 min read",
    image: "https://placehold.co/800x400/purple/white?text=Reading+Tips",
    tags: ["reading", "parenting", "education", "children", "literacy"]
  };

  const relatedPosts = [
    {
      id: 2,
      title: "Age-Appropriate Screen Time Guidelines for Children",
      image: "https://placehold.co/300x200/blue/white?text=Screen+Time",
      readTime: "7 min read"
    },
    {
      id: 4,
      title: "Building Emotional Intelligence Through Storytelling",
      image: "https://placehold.co/300x200/pink/white?text=Emotional+Intelligence",
      readTime: "4 min read"
    },
    {
      id: 6,
      title: "The Benefits of Interactive Learning for Young Minds",
      image: "https://placehold.co/300x200/teal/white?text=Interactive+Learning",
      readTime: "5 min read"
    }
  ];

  return (
    <div>
      <UserTracker contentType="general" contentId={postId as string} />
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4">
            <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              ← Back to Blog
            </Link>

            <article className="max-w-4xl mx-auto">
              <div className="mb-6">
                <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  📚 Parenting Tips
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{blogPost.title}</h1>
              <div className="flex items-center text-white/90 text-base mb-8">
                <span className="font-medium">By {blogPost.author}</span>
                <span className="mx-3">•</span>
                <span>{new Date(blogPost.date).toLocaleDateString()}</span>
                <span className="mx-3">•</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{blogPost.readTime}</span>
              </div>
            </article>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <article className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="mb-12">
              <img
                src={blogPost.image}
                alt={blogPost.title}
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-gray-200">
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">🏷️ Tags</h3>
              <div className="flex flex-wrap gap-3">
                {blogPost.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold hover:from-purple-200 hover:to-pink-200 cursor-pointer transition-all duration-300 transform hover:scale-105"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">👨‍💼 About the Author</h3>
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">
                    {blogPost.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{blogPost.author}</h4>
                  <p className="text-gray-600 text-base leading-relaxed">{blogPost.authorBio}</p>
                </div>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">📤 Share this article</h3>
              <div className="flex flex-wrap gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center space-x-2 transform hover:scale-105">
                  <span>📘</span>
                  <span>Facebook</span>
                </button>
                <button className="bg-blue-400 text-white px-6 py-3 rounded-xl hover:bg-blue-500 transition-all duration-300 font-semibold flex items-center space-x-2 transform hover:scale-105">
                  <span>🐦</span>
                  <span>Twitter</span>
                </button>
                <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold flex items-center space-x-2 transform hover:scale-105">
                  <span>📱</span>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Related Posts */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">📖 Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(post => (
                  <Link href={`/blog/${post.id}`} key={post.id}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 hover:border-purple-300">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-6">
                        <h4 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2">{post.title}</h4>
                        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-12 text-center shadow-lg">
              <h3 className="text-3xl font-bold mb-4">📧 Stay Updated</h3>
              <p className="text-xl mb-8 opacity-90">
                Get the latest parenting tips and educational insights delivered to your inbox.
              </p>
              <div className="max-w-md mx-auto flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white text-lg"
                />
                <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </div>
  );
}
