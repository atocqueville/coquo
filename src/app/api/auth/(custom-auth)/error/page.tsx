import Link from 'next/link';
import { AlertTriangle, ArrowLeft, LifeBuoy, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getAdminEmail } from '@/lib/api/user';

export const dynamic = 'force-dynamic';

export default async function ErrorPage() {
    const adminEmail = await getAdminEmail();

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                            <AlertTriangle className="h-8 w-8 text-amber-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Accès refusé</CardTitle>
                    <CardDescription className="text-base">
                        Votre adresse email n&apos;a pas encore été vérifiée
                    </CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <p>
                            Pour accéder à votre compte, il doit d&apos;abord
                            être validé par votre administrateur. Une demande a
                            été envoyée à<strong> {adminEmail}</strong>.
                        </p>

                        <div className="rounded-lg bg-muted p-4">
                            <div className="flex items-start gap-4">
                                <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                <div className="space-y-1">
                                    <h4 className="font-medium">
                                        Il a peut-être oublié de vérifier votre
                                        compte..
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Prenez votre courage à deux mains et
                                        envoyez-lui un message pour lui rappeler
                                        de vérifier votre compte.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <div className="w-full flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" className="flex-1" asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour à l&apos;accueil
                            </Link>
                        </Button>
                        <Button variant="outline" className="flex-1" asChild>
                            <Link href="/contact">
                                <LifeBuoy className="mr-2 h-4 w-4" />
                                Contacter le support
                            </Link>
                        </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                        Si vous rencontrez des problèmes pour vérifier votre
                        email, veuillez contacter notre équipe de support.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
