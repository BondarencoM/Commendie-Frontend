import { groupBy } from 'src/app/utils/ArrayUtils'
import { Images } from 'src/app/utils/Images'
import { Recommendation } from '../recommendations/Recommendation'

export class PersonaWithInterests{
    id: number
    name: string
    description: string
    imageUri?: string
    wikiId: string
    wikipediaUri: string
    recommendations: Recommendation[] = []

    constructor (init?: Partial<PersonaWithInterests>){
        Object.assign(this, init)
    }

    get confirmedRecommendations(): Recommendation[] { return this.recommendations.filter(r => r.isConfirmed) }

    get pendingRecommendations(): Recommendation[] { return this.recommendations.filter(r => !r.isConfirmed) }

    static AttachMethods(input: PersonaWithInterests): PersonaWithInterests{
        const result = Object.assign(new PersonaWithInterests(), input);
        if (input.recommendations){
            result.recommendations = input.recommendations.map(Recommendation.AttachMethods)
        }
        return result;
    }

    get shortRecommendationsList(): Recommendation[]{
        return this.confirmedRecommendations.slice(0, 4)
    }

    getProfileImagePath({fallback = '', width = 600} = {}): string{
        return this.imageUri ? this.imageUri + '?width=' + width : ''
                    || fallback
                    || Images.FallbackPersonaImage
    }

    geConfirmedtRecommendationsByType(): {[key: string]: Recommendation[] }{
        return groupBy<Recommendation>(this.confirmedRecommendations, r => r.interest.type)
    }
}
