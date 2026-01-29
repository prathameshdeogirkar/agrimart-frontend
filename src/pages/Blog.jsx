import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Benefits of Organic Farming',
      excerpt: 'Discover how organic farming practices benefit both the environment and your health.',
      image: 'https://images.pexels.com/photos/1719669/pexels-photo-1719669.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 2,
      title: 'Sustainable Agriculture Practices',
      excerpt: 'Learn about sustainable farming methods that help preserve our planet for future generations.',
      image: 'https://images.pexels.com/photos/2382904/pexels-photo-2382904.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 3,
      title: 'Fresh Produce Storage Tips',
      excerpt: 'Essential tips for storing fresh fruits and vegetables to maintain their quality and nutrition.',
      image: 'https://images.pexels.com/photos/4421377/pexels-photo-4421377.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  return (
    <>
      <div className="min-h-screen pt-[70px] bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Blog</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-600">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;


