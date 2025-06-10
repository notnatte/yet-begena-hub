
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/pages/Index";
import { Upload, CreditCard } from "lucide-react";

interface Course {
  id: string;
  title: string;
  price: number;
}

interface PaymentDialogProps {
  course: Course;
  user: UserProfile;
}

const PaymentDialog = ({ course, user }: PaymentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const receiptFile = formData.get('receipt') as File;

    if (!receiptFile) {
      toast({
        title: "Receipt required",
        description: "Please upload your payment receipt.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Upload receipt to storage
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(fileName, receiptFile);

      if (uploadError) throw uploadError;

      // Create purchase record with auto-verification
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          course_id: course.id,
          amount: course.price,
          receipt_url: fileName,
          is_verified: true, // Auto-verify purchase
          verified_at: new Date().toISOString(),
          verified_by: user.id // Self-verified
        });

      if (purchaseError) throw purchaseError;

      toast({
        title: "Payment successful!",
        description: "You now have access to the course materials.",
      });

      setIsOpen(false);
      // Refresh the page to update course access
      window.location.reload();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CreditCard className="h-4 w-4 mr-2" />
          Enroll Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Course</DialogTitle>
          <DialogDescription>
            Complete your payment for "{course.title}" - {course.price} ETB
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Payment Instructions:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Transfer {course.price} ETB to our bank account</li>
              <li>Take a screenshot or photo of your payment receipt</li>
              <li>Upload the receipt below</li>
              <li>You'll get instant access to the course!</li>
            </ol>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Bank Details:</h4>
            <p className="text-sm">
              Bank: Commercial Bank of Ethiopia<br />
              Account: 1234567890<br />
              Account Name: EduPlatform Ethiopia
            </p>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="receipt">Upload Payment Receipt</Label>
              <Input 
                id="receipt"
                name="receipt"
                type="file" 
                accept="image/*,.pdf"
                required 
              />
              <p className="text-sm text-muted-foreground">
                Accepted formats: JPG, PNG, PDF
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Purchase"
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
