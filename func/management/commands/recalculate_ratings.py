from django.core.management.base import BaseCommand
from func.models import CompetitionsModel, CompetitionResult


class Command(BaseCommand):
    help = 'Пересчитывает рейтинговые очки для всех соревнований'

    def add_arguments(self, parser):
        parser.add_argument(
            '--competition',
            type=int,
            help='ID конкретного соревнования для пересчета',
        )

    def handle(self, *args, **options):
        competition_id = options.get('competition')
        
        if competition_id:
            # Пересчет для одного соревнования
            try:
                competition = CompetitionsModel.objects.get(pk=competition_id)
                self.recalculate_competition(competition)
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ Рейтинг пересчитан для соревнования #{competition_id}'
                    )
                )
            except CompetitionsModel.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(
                        f'✗ Соревнование #{competition_id} не найдено'
                    )
                )
        else:
            # Пересчет для всех соревнований
            competitions = CompetitionsModel.objects.all()
            total = competitions.count()
            
            self.stdout.write(f'Найдено соревнований: {total}')
            
            for idx, competition in enumerate(competitions, 1):
                self.recalculate_competition(competition)
                self.stdout.write(
                    self.style.SUCCESS(
                        f'[{idx}/{total}] ✓ {competition.type} - {competition.date}'
                    )
                )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'\n✓ Пересчет завершен! Обработано соревнований: {total}'
                )
            )

    def recalculate_competition(self, competition):
        """
        Пересчитывает коэффициент и рейтинговые очки для соревнования
        """
        # Обновляем статус рейтинговости
        competition.is_raiting = competition.check_is_rating() if hasattr(competition, 'check_is_rating') else False
        
        # Обновляем коэффициент
        if hasattr(competition, 'calculate_coefficient'):
            competition.cof = competition.calculate_coefficient()
        
        competition.save()
        
        # Пересчитываем очки для всех результатов
        results = CompetitionResult.objects.filter(competition=competition)
        
        for result in results:
            result.save()  # save() автоматически пересчитает очки
        
        self.stdout.write(f'  └─ Пересчитано результатов: {results.count()}')

