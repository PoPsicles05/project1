'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/components/ui/use-toast'
export default function Profile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [password, setPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetchProfile()
  }, [])
  async function fetchProfile() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setName(user.user_metadata.full_name || '')
      setEmail(user.email || '')
      setContactNo(user.user_metadata.phone || '')
      setAvatarUrl(user.user_metadata.avatar_url || '')
    }
    setLoading(false)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      email,
      password: password || undefined,
      data: { full_name: name, phone: contactNo }
    })
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      })
    }
    setLoading(false)
  }
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${Date.now()}_${file.name}`, file)
      if (error) {
        toast({
          title: "Error",
          description: "Failed to upload avatar. Please try again.",
          variant: "destructive",
        })
      } else if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.path)
        
        setAvatarUrl(publicUrl)
        await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        })
      }
    }
  }
  if (loading) {
    return <div>Loading profile...</div>
  }
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNo">Contact Number</Label>
              <Input
                id="contactNo"
                type="tel"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password to update"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Update Profile</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
